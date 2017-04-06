// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // implement a count var set equal to 0
      var sum = function( a, b ) { return a + b };
      var countRow = _.reduce(this.rows()[rowIndex],sum, 0);
      return countRow >=2; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      var anyConflicts = false;
      for ( var i =0 ; i < this.rows().length; i++ ) {
        if (this.hasRowConflictAt(i) ) {
          anyConflicts = true;
        }
      }
      return anyConflicts; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // make an array to hold an array of colums
      var colums = [];
      for (var i = 0; i < this.rows().length; i++) {
        // for each index of row, push push to colums array
        colums.push(this.rows()[i][colIndex]);
      }
      // make asum function
      var sum = function( a, b ) { return a + b };
      // reduce coll
      var colNum = _.reduce(colums, sum, 0);
      return colNum > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // 
      var anyConflicts = false;
      for ( var i =0 ; i < this.rows().length; i++ ) {
        if (this.hasColConflictAt(i) ) {
          anyConflicts = true;
        }
      }
      return anyConflicts; 
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
    /*
    tyler's refactor of this method
     hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var arrOfArrays = this.rows();
      var count = 0;
      //arrOfArrays.forEach(row => {
        // row.forEach(index)
      })
      for(var i = 0; i < arrOfArrays.length; i++) {
        for (var j = 0; j < arrOfArrays.length; j++) {
          var column = arrOfArrays[i][j];
          if(this._getFirstRowColumnIndexForMajorDiagonalOn(i, j) === majorDiagonalColumnIndexAtFirstRow) {
            if(column === 1) {
              count++;
            }
          }
        }
      }
      return (count > 1 ? true : false);
    },
    */
    var queenArr = [];
    var arrLength = this.get("n")
    // loop through board's row
    
    for (var i = 0; i < arrLength; i++) {
      // loop through columns
      for (var j = 0; j < arrLength; j++) {
        //if postition at row && column contains queen
        if(this.get(i)[j] === 1){
        // diagonal index value = column[index] - row[index]
        //add to array
          queenArr.push(j - i);
        }
      }
    }
    var counter = function (array, target) {
      var count = 0;
      _.each(array, function(value){
        if(value === target) {
          count++;
        }
      });
      return count;
    }


    
    //console.log(counter(queenArr, majorDiagonalColumnIndexAtFirstRow))
    return ( counter(queenArr, majorDiagonalColumnIndexAtFirstRow) > 1 ? true : false )


      
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var lenOfMatrix = this.get('n'); // 4 , 5
      var arrOfDiagonals = [0]
      for ( var i = 1; i < lenOfMatrix; i++) {
        arrOfDiagonals.push(i,-i);
      }
      
      for ( var i = 0 ; i < this.rows().length; i++ ) {
          if ( this.hasMajorDiagonalConflictAt(arrOfDiagonals[i]) ) {
            return true;
        }
      }
      return false; 
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      //console.log('minor', minorDiagonalColumnIndexAtFirstRow)
      var arrOfArrays = this.rows();
      var count = 0;
       
      for(var i = 0; i < arrOfArrays.length; i++) {
        for (var j = 0; j < arrOfArrays.length; j++) {
          var column = arrOfArrays[i][j];
          if(this._getFirstRowColumnIndexForMinorDiagonalOn(i, j) === minorDiagonalColumnIndexAtFirstRow) {
            if(column === 1) {
              console.log(i,j);
              count++;
            }
          }
        }
      }
      return (count > 1 ? true : false);
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      var lenOfMatrix = this.get('n'); // 4 , 5
      var arrOfDiagonals = []
      for ( var i = 0; i < lenOfMatrix + 3; i++) {
        arrOfDiagonals.push(i);
      }
      
      for ( var i = 0 ; i < arrOfDiagonals.length; i++ ) {

          if ( this.hasMinorDiagonalConflictAt(arrOfDiagonals[i]) ) {
            return true;
        }
      }
      return false; 
    
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
