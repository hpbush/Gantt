'use strict';

function SystemIdGenerator(id) {
  this.masterId = id || 0;

  this.assignId = function () {
    return this.masterId++;
  };
}

function Schedule(projectStartDate, projectEndDate) {
  this.tasks = [];
  this.projectStartDate = projectStartDate;
  this.projectEndDate = projectEndDate;

  this.addTaskToSchedule = function (task) {
    this.tasks.push(task);
  };
}

function Task(name, children, parents, startDate, endDate) {
  this.name = name;
  this.children = children;
  this.parents = parents;
  this.startDate = startDate;
  this.endDate = endDate;
  this.delayDays = 0;
  this.id = SystemIdGeneratorInstance.assignId();

  this.addChild = function (child) {
    this.children.push(child);
    child.parents.push(this);
  };

  this.addParent = function (parent) {
    this.parents.push(parent);
    parent.children.push(this);
  };

  this.removeChild = function (child) {
    var indexOfChild = this.children.indexOf(child);
    var indexOfParent = child.parents.indexOf(this);
    this.children.splice(indexOfChild, 1);
    child.parents.splice(indexOfParent, 1);
  };

  this.removeParent = function (parent) {
    var indexOfParent = this.parents.indexOf(parent);
    var indexOfChild = parent.children.indexOf(this);
    this.parents.splice(indexOfParent, 1);
    parent.children.splice(indexOfChild, 1);
  };

  this.changeName = function (newName) {
    this.name = newName;
  };

  this.changeDelayDays = function (newDelay) {
    this.delayDays = newDelay;
  };

  this.changeStartDate = function (newStartDate) {
    this.startDate = newStartDate;
  };

  this.changeEndDate = function (newEndDate) {
    this.endDate = newEndDate;
  };

  this.getId = function () {
    return this.id;
  };
}

////////////////////////////////////////////////////////////////////////////////
//Main Code
////////////////////////////////////////////////////////////////////////////////
var SystemIdGeneratorInstance = new SystemIdGenerator();

////////////////////////////////////////////////////////////////////////////////
//Test Suite
////////////////////////////////////////////////////////////////////////////////
function runAllTests() {
  TaskTestSuite.runAllTaskTests();
  console.log(' ');
  ScheduleTestSuite.runAllScheduleTests();
  console.log(' ');
  SystemIdGeneratorTestSuite.runAllSystemIdGeneratorTests();
}

function runTest(testPass, testName) {
  if (testPass) console.log('  ' + testName + ": Pass");else console.log('   ' + testName + ": Fail");
}

var TaskTestSuite = {
  parent: new Task('parent', [], []),
  child: new Task('child', [], []),

  runAllTaskTests: function runAllTaskTests() {
    console.log("Task Test Suite: ");
    runTest(this.testAddingTask(), 'AddingTask');
    runTest(this.testAddParent(), 'addParent');
    runTest(this.testAddChild(), 'addChild');
    runTest(this.testChangeStartDate(), 'changeStartDate');
    runTest(this.testChangeEndDate(), 'changeEndDate');
    runTest(this.testChangeDelayDays(), 'changeDelayDays');
    runTest(this.testGetId(), 'getID');
    runTest(this.testRemoveParent(), 'removeParent');
    runTest(this.testRemoveChild(), 'removeChild');
  },

  testAddingTask: function testAddingTask() {
    this.setUp();

    if (this.parent.constructor.prototype.constructor === Task) return true;
    return false;
  },

  testAddParent: function testAddParent() {
    this.setUp();

    this.parent.addChild(this.child);

    if (this.parent.children[0] === this.child && this.child.parents[0] === this.parent) return true;
    return false;
  },

  testAddChild: function testAddChild() {
    this.setUp();

    this.child.addParent(this.parent);

    if (this.parent.children[0] === this.child && this.child.parents[0] === this.parent) return true;
    return false;
  },

  testRemoveParent: function testRemoveParent() {
    this.setUp();
    this.child.addParent(this.parent);

    this.child.removeParent(this.parent);

    if (this.child.parents.length === 0 && this.parent.children.length === 0) return true;
    return false;
  },

  testRemoveChild: function testRemoveChild() {
    this.setUp();
    this.parent.addChild(this.child);

    this.parent.removeChild(this.child);

    if (this.child.parents.length === 0 && this.parent.children.length === 0) return true;
    return false;
  },

  testChangeStartDate: function testChangeStartDate() {
    this.parent.changeStartDate(new Date(2016, 11, 25));

    if (this.parent.startDate.getTime() === new Date(2016, 11, 25).getTime()) return true;
    return false;
  },

  testChangeEndDate: function testChangeEndDate() {
    this.parent.changeEndDate(new Date(2016, 11, 25));

    if (this.parent.endDate.getTime() === new Date(2016, 11, 25).getTime()) return true;
    return false;
  },

  testChangeDelayDays: function testChangeDelayDays() {
    this.parent.changeDelayDays(2);

    if (this.parent.delayDays === 2) return true;
    return false;
  },

  testGetId: function testGetId() {
    var id = this.parent.getId();

    if (this.parent.id === id) return true;
    return false;
  },

  setUp: function setUp() {
    this.parent = new Task('parent', [], []);
    this.child = new Task('child', [], []);
  }
};

var ScheduleTestSuite = {
  schedule: new Schedule(new Date(2016, 0, 0), new Date(2016, 0, 1)),

  runAllScheduleTests: function runAllScheduleTests() {
    console.log('Schedule Test Suite: ');
    runTest(this.testAddTaskToSchedule(), 'addTaskToSchedule');
  },

  testAddTaskToSchedule: function testAddTaskToSchedule() {
    this.schedule.addTaskToSchedule(new Task('test', [], []));

    if (this.schedule.tasks[0].name === 'test') return true;
    return false;
  },

  testRemoveTaskFromSchedule: function testRemoveTaskFromSchedule() {
    this.schedule.addTaskToSchedule(new Task('test1', [], []));
    this.schedule.addTaskToSchedule(new Task('test2', [], []));
    this.schedule.addTaskToSchedule(new Task('test3', [], []));

    this.schedule.removeTaskFromSchedule();
  }
};

var SystemIdGeneratorTestSuite = {
  systemIdGen: new SystemIdGenerator(),

  runAllSystemIdGeneratorTests: function runAllSystemIdGeneratorTests() {
    console.log('System Id Generator Test Suite: ');
    runTest(this.testAssignId(), 'assign ID');
  },

  testAssignId: function testAssignId() {
    this.systemIdGen.assignId();

    if (this.systemIdGen.masterId === 1) return true;
    return false;
  }
};

runAllTests();