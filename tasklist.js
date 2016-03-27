
Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Meteor.subscribe('tasks');
  Template.tasks.helpers({
    tasks: function(){
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

Template.tasks.events({
  "submit .add-task": function(event){
    var name =event.target.name.value;

  Meteor.call('addTask', name);
  event.target.name.value = '';

    return false;
  },
  "dblclick .edit-task": function(event){
    Template.edit.
      Meteor.call('editTask', this._id);
    return false;
  },
  "click .delete-task": function(event){
    if (confirm('delete task?')){
      Meteor.call('deleteTask', this._id);
    }
    return false;
  }
});

}

if (Meteor.isServer) {
  Meteor.publish('tasks', function(){
    return Tasks.find({userId: this.userId});
  });
}

Meteor.methods ({
  addTask: function(name){
    if(!Meteor.userId()){
      throw new Meteor.Error('No access!');
    }
    Tasks.insert({
      name:name,
      createdAt: new Date(),
      userId: Meteor.userId()
    });

  },
  editTask: function(taskId, name){
    Tasks.remove(taskId);
    Tasks.insert({
      name:name,
      createdAt: new Date(),
      userId: Meteor.userId()
    });
  },
  deleteTask: function(taskId){
    Tasks.remove(taskId);
  }
});
