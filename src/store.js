import Vue from 'vue';
import Vuex from 'vuex';
import defaultBoard from './default-board';
import { saveStatePlugin, uuid } from './utils';

Vue.use( Vuex );

// const board = JSON.parse( localStorage.getItem( 'board' ) ) || defaultBoard;

export default new Vuex.Store( {
  state    : { board: defaultBoard },
  mutations: {
    CREATE_TASK( state, { tasks, name } ) {
      tasks.push( {
        name,
        id         : uuid(),
        description: ''
      } );
    },
    UPDATE_TASK( state, { task, key, value } ) {
      task[ key ] = value;
      // Vue.set( task, key, value );
    },
    MOVE_TASK( state, {
      fromTasks,
      toTasks,
      fromTaskIndex,
      toTaskIndex
    } ) {

      const taskMove = fromTasks.splice( fromTaskIndex, 1 )[ 0 ];
      toTasks.push( taskMove );

    },
    MOVE_COLUMN( state, { fromColumnIndex, toColumnIndex } ) {
      const columnList = state.board.columns;
      const columnToMove = state.board.columns.splice( fromColumnIndex, 1 )[ 0 ];
      columnList.splice( toColumnIndex, 0, columnToMove );
    },
  },
  plugins  : [ saveStatePlugin ],
  getters  : {
    getTask( state ) {
      return id => {
        for ( const column of state.board.columns ) {
          for ( const task of column.tasks ) {
            if ( task.id === id ) {
              return task;
            }
          }
        }
      };
    }
  },
} );
