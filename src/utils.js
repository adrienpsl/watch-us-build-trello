export function uuid() {
  return Math.random()
             .toString( 16 )
             .slice( 2 );
}

export function saveStatePlugin( store ) {

  store.subscribe(
    ( mutation, state ) => {
      console.log( '***********************88 save' );
      localStorage.setItem( 'board', JSON.stringify( state.board ) );
    }
  );
}
