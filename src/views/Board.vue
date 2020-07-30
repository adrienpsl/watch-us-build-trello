<template>
  <div class="board">
    <div class="flex flex-row items-start">

      <div :key="$columnIndex"
           @dragenter.prevent
           @dragover.prevent
           @dragstart.self="pickupColumn($event,  $columnIndex)"
           @drop="moveTaskOrColumn($event, column.tasks, $columnIndex)"
           class="column"
           draggable="true"
           v-for="(column, $columnIndex) of board.columns"
      >
        <div class="flex items-center mb-2 font-fold">
          {{ column.name }}
        </div>

        <div class="list-reset">
          <div
            :key="$taskIndex"
            @click="goToTask(task)"
            @dragenter.prevent
            @dragover.prevent
            @dragstart="pickupTask($event, $taskIndex, $columnIndex)"
            @drop.stop="moveTask($event, column.tasks, $taskIndex)"
            class="task"
            draggable="true"
            v-for="(task, $taskIndex) of column.tasks">

            <span class="w-full flex-no-shrink font-bold">
              {{ task.name }}
            </span>
            <p class="w-full flex-no-shrink mt-1 text-small"
               v-if="task.description">
              {{ task.description }}
            </p>

          </div>
        </div>
        <input
          @keyup.enter="createTask($event, column.tasks)"
          class="block p-2 w-full bg-transparent"
          placeholder="+ Enter new task"
          type="text"
        />
      </div>

      <!--      self, work only if we click that div, and not his children -->
      <div
        @click.self="close"
        class="task-bg"
        v-if="isTaskOpen">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState( [ 'board' ] ),

      isTaskOpen() {
        // the name of the childre of that route
        return this.$route.name === 'task';
      }
    },
    methods : {
      pickupColumn( e, fromColumnIndex ) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';

        e.dataTransfer.setData( 'from-column-index', fromColumnIndex );
        e.dataTransfer.setData( 'type', 'column' );
      },

      createTask( e, tasks ) {
        this.$store.commit( 'CREATE_TASK', {
          tasks, name: e.target.value
        } );
        e.target.value = '';
      },

      close() {
        this.$router.push( { name: 'board' } );
      },

      goToTask( task ) {
        this.$router.push( { name: 'task', params: { id: task.id } } );
      },

      pickupTask( e, taskIndex, fromColumnIndex ) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';

        e.dataTransfer.setData( 'task-index', taskIndex );
        e.dataTransfer.setData( 'from-column-index', fromColumnIndex );
        e.dataTransfer.setData( 'type', 'task' );
      },

      moveTaskOrColumn( e, toTasks, toColumnIndex ) {
        const type = e.dataTransfer.getData( 'type' );
        if ( type === 'task' ) {
          this.moveTask( e, toTasks );
        }
        else {
          this.moveColumn( e, toColumnIndex );
        }
      },

      moveTask( e, toTasks, toTaskIndex ) {
        const fromColumnIndex = e.dataTransfer.getData( 'from-column-index' );
        const fromTasks = this.board.columns[ fromColumnIndex ].tasks;
        const fromTaskIndex = e.dataTransfer.getData( 'task-index' );
        console.log( { fromColumnIndex, fromTasks, fromTaskIndex } );

        this.$store.commit( 'MOVE_TASK', {
          fromTasks,
          toTasks,
          toTaskIndex,
          fromTaskIndex
        } );
      },

      moveColumn( e, toColumnIndex ) {
        const fromColumnIndex = e.dataTransfer.getData( 'from-column-index' );
        this.$store.commit( 'MOVE_COLUMN', {
          fromColumnIndex,
          toColumnIndex
        } );
      }
    }
  };
</script>

<style lang="css">
  .task {
    @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
  }

  .column {
    @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
    min-width: 350px;
  }

  .board {
    @apply p-4 bg-teal-dark h-full overflow-auto;
  }

  .task-bg {
    @apply pin absolute;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
