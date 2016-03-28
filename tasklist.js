
Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Meteor.subscribe('tasks');
  Template.tasks.helpers({
    tasks: function(){
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

Template.profilePage.helpers({
email: function () {
  return Meteor.user().emails[0].address;
}
});


Template.tasks.events({
  "submit .add-task": function(event){
    var name =event.target.name.value;

  Meteor.call('addTask', name);
  event.target.name.value = '';

    return false;
  },
  "submit .edit-task": function(event){
    var name =event.target.name.value;
  Meteor.call('changeTask', name);
    return false;
  },
  "dblclick .edit-task": function(event, target){
    console.log('gdgbds');
    return Session.set("target" + this._id, true);
    // Meteor.call('editTask', this._id);
    // return false;
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
  editTask: function(taskId){
    console.log("here");

    //    function(taskId, name){
    // console.log("got here");
  // Tasks.update(taskId, {
  //     $set: {name: input[name]}
  //   });
  },
  changeTask: function(event, target){
         Tasks.update(this._id, {
           $set: {task: event.currentTarget.value}
         });
          return Session.set("target" + target.data._id, false);
       },


  deleteTask: function(taskId){
    Tasks.remove(taskId);
  }
});
