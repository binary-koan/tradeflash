function Category(name) {
  this.name = name;
  this.values = [];
  this.apiRequest();
}

Category.prototype.next = function() {
  return this.values.shift();
};

Category.prototype.apiRequest = function() {
  // Do API request and add results to this.values[]
};

module.exports = {
  load: function(callback) {
    // Do API call, add Category instances to categories
  }
};
