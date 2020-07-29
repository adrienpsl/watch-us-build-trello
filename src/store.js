import Vue from 'vue';
import Vuex from 'vuex';
import defaultBoard from './default-board';
import { saveStatePlugin } from './utils';

Vue.use( Vuex );

const board = JSON.parse( localStorage.getItem( 'board' ) ) || defaultBoard;

export default new Vuex.Store( {
  state    : { board },
  mutations: {},
  getters  : {
    getTask( state ) {
      return id => {
        for ( const column of state.board.columns ) {
          for ( const task of column.tasks ) {
            console.log( task.id, task.name, id );
            if ( task.id === id ) {
              console.log( task );
              return task;
            }
          }
        }
      };
    }
  },
  plugins  : [ saveStatePlugin ],
} );
