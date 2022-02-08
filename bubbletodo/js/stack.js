//
// Stack (LIFO)
//

function Stack() {
  this.__a = new Array();
}

Stack.prototype.push = function(o) {
  this.__a.push(o);
}

Stack.prototype.pop = function() {
  if( this.__a.length > 0 ) {
    return this.__a.pop();
  }
  return null;
}

Stack.prototype.size = function() {
  return this.__a.length;
}

Stack.prototype.toString = function() {
  return '[' + this.__a.join(',') + ']';
}
