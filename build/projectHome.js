'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SystemIdGenerator = function () {
  function SystemIdGenerator(id) {
    _classCallCheck(this, SystemIdGenerator);

    this.masterId = id || 0;
  }

  _createClass(SystemIdGenerator, [{
    key: 'assignId',
    value: function assignId() {
      return this.masterId++;
    }
  }]);

  return SystemIdGenerator;
}();

var Schedule = function () {
  function Schedule(projectStartDate, projectEndDate) {
    _classCallCheck(this, Schedule);

    this.tasks = [];
    this.projectStartDate = projectStartDate;
    this.projectEndDate = projectEndDate;
  }

  _createClass(Schedule, [{
    key: 'addTaskToSchedule',
    value: function addTaskToSchedule(task) {
      this.tasks.push(task);
    }
  }, {
    key: 'replaceTasksWithOrganized',
    value: function replaceTasksWithOrganized(tasks) {
      this.tasks = tasks;
    }
  }]);

  return Schedule;
}();

var Task = function () {
  function Task(name, children, parents, startDate, endDate) {
    _classCallCheck(this, Task);

    this.name = name;
    this.children = children;
    this.parents = parents;
    this.masterParent;
    this.startDate = startDate;
    this.endDate = endDate;
    this.delayDays = 0;
    this.id = systemIdGenerator.assignId();
    this.calendarBlocks = [];
  }

  _createClass(Task, [{
    key: 'addParent',
    value: function addParent(parent) {
      this.parents.push(parent);
      parent.children.push(this);
    }
  }, {
    key: 'removeParent',
    value: function removeParent(parent) {
      var indexOfParent = this.parents.indexOf(parent);
      var indexOfChild = parent.children.indexOf(this);
      this.parents.splice(indexOfParent, 1);
      parent.children.splice(indexOfChild, 1);
    }
  }, {
    key: 'setMasterParent',
    value: function setMasterParent() {
      if (this.parents.length > 0) {
        var MPcandidate = this.parents[0];
        var laregestEndDateFound = MPcandidate.endDate;
        for (var i = 1; i < this.parents.length; i++) {
          var dateBeingChecked = this.parents[i].endDate;
          if (dateBeingChecked > laregestEndDateFound) {
            MPcandidate = this.parents[i];
          }
        }
        this.masterParent = MPcandidate;
      }
    }
  }, {
    key: 'getMasterParent',
    value: function getMasterParent() {
      return this.masterParent;
    }
  }, {
    key: 'changeName',
    value: function changeName(newName) {
      this.name = newName;
    }
  }, {
    key: 'changeDelayDays',
    value: function changeDelayDays(newDelay) {
      this.delayDays = newDelay;
    }
  }, {
    key: 'changeStartDate',
    value: function changeStartDate(newStartDate) {
      this.startDate = newStartDate;
    }
  }, {
    key: 'changeEndDate',
    value: function changeEndDate(newEndDate) {
      this.endDate = newEndDate;
    }
  }, {
    key: 'getStartDate',
    value: function getStartDate() {
      return this.startDate;
    }
  }, {
    key: 'getEndDate',
    value: function getEndDate() {
      return this.endDate;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }, {
    key: 'setCalendarBlocksInTask',
    value: function setCalendarBlocksInTask(calendarBlockArr) {
      this.calendarBlocks = calendarBlockArr;
    }
  }, {
    key: 'getCalendarBlocks',
    value: function getCalendarBlocks() {
      return this.calendarBlocks;
    }
  }]);

  return Task;
}();

var Printer = function () {
  function Printer() {
    _classCallCheck(this, Printer);

    this.units = 'month';
    this.numberOfUnitsToDisplay = 10;
    this.startDate = new Date(2016, 0, 1);
    this.endDate;
    this.labelClassName;
    this.MilisecondsPerDay = 86400000;
  }

  _createClass(Printer, [{
    key: 'convertUnitsToDays',
    value: function convertUnitsToDays(numberOfUnits, startDate) {
      switch (this.units) {
        case 'day':
          return numberOfUnits;
        case 'week':
          return numberOfUnits * 7;
        case 'month':
          return this.convertMonthsToDays(numberOfUnits, startDate);
        default:
          return numberOfUnits;
      }
    }
  }, {
    key: 'convertMonthsToDays',
    value: function convertMonthsToDays(numberOfUnits, startDate) {
      var currentMonth = startDate.getMonth() - 1;
      var currentYear = startDate.getFullYear();
      var totalNumberOfDays = 0;
      for (var i = 0; i < numberOfUnits; i++) {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        totalNumberOfDays += this.daysInMonth(currentMonth, currentYear);
      }
      return totalNumberOfDays;
    }
  }, {
    key: 'daysInMonth',
    value: function daysInMonth(month, year) {
      switch (month) {
        case 0:
          return 31;
        case 1:
          return 28 + this.leapYear(year);
        case 2:
          return 31;
        case 3:
          return 30;
        case 4:
          return 31;
        case 5:
          return 30;
        case 6:
          return 31;
        case 7:
          return 31;
        case 8:
          return 30;
        case 9:
          return 31;
        case 10:
          return 30;
        default:
          return 31;
      }
    }
  }, {
    key: 'leapYear',
    value: function leapYear(year) {
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) return 1;
      return 0;
    }
  }, {
    key: 'createDiv',
    value: function createDiv(parent, className, style) {
      var div = document.createElement('div');
      div.setAttribute('class', className);
      div.style.backgroundColor = style.color;
      div.style.width = style.width;
      if (style.left) {
        div.style.left = style.left;
      }
      parent.appendChild(div);
      return div;
    }
  }, {
    key: 'createLabelFor',
    value: function createLabelFor(div, content) {
      var label = document.createElement('label');
      label.setAttribute('class', this.labelClassName);
      var labelContent = document.createTextNode(content);
      label.appendChild(labelContent);
      div.appendChild(label);
    }
  }]);

  return Printer;
}();

var CalendarPrinter = function (_Printer) {
  _inherits(CalendarPrinter, _Printer);

  function CalendarPrinter() {
    _classCallCheck(this, CalendarPrinter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CalendarPrinter).call(this));

    _this.primaryColor = '#999';
    _this.secondaryColor = '#eee';
    _this.divClassName = 'calendarUnitBlock';
    _this.labelClassName = 'calendarUnitBlockLabel';
    _this.calendarBlocks = [];
    return _this;
  }

  _createClass(CalendarPrinter, [{
    key: 'printCalendar',
    value: function printCalendar() {
      var date = this.startDate;
      for (var i = 0; i < this.numberOfUnitsToDisplay; i++) {
        this.createCalendarBlock(i, date);
        date = this.getNewCalendarDate(date);
      }
      this.assignLabelPosition();
    }
  }, {
    key: 'createCalendarBlock',
    value: function createCalendarBlock(currentBlock, date) {
      var style = {
        width: 100 / this.numberOfUnitsToDisplay + '%',
        color: this.secondaryColor
      };
      if (currentBlock % 2 === 0) {
        style.color = this.primaryColor;
      }
      var parent = document.getElementById('gantt_Chart');
      var div = this.createDiv(parent, 'calendarUnitBlock', style);

      var labelDate = this.formatDateForLabelText(date);
      this.createLabelFor(div, labelDate);

      var endDateInMsWithExtraDay = this.getNewCalendarDate(date).getTime();
      var endDateInMs = endDateInMsWithExtraDay - this.MilisecondsPerDay;
      var endDate = new Date(endDateInMs);
      var calendarBlock = new CalendarBlock(div, date, endDate);
      this.calendarBlocks.push(calendarBlock);
    }
  }, {
    key: 'formatDateForLabelText',
    value: function formatDateForLabelText(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return month + "/" + day + "/" + year;
    }
  }, {
    key: 'getNewCalendarDate',
    value: function getNewCalendarDate(oldDate) {
      var numDays = this.convertUnitsToDays(1, oldDate);
      var numMsInDays = numDays * this.MilisecondsPerDay;
      var numMsInDate = oldDate.getTime();
      var newDateTotalMs = numMsInDays + numMsInDate;
      return new Date(newDateTotalMs);
    }
  }, {
    key: 'assignLabelPosition',
    value: function assignLabelPosition() {
      var divList = document.querySelectorAll('.calendarUnitBlock');
      var halfDivWidth = divList[0].getBoundingClientRect().width / 2;
      for (var i = 0; i < divList.length; i++) {
        var label = divList[i].firstChild;
        var labelWidth = label.getBoundingClientRect().width;
        var leftEdgeDivFromWindow = divList[i].getBoundingClientRect().left;
        var leftEdgeLabelFromWindow = label.getBoundingClientRect().left;
        var divMidPoint = leftEdgeDivFromWindow + halfDivWidth;
        var numPixelsToShift = leftEdgeLabelFromWindow + labelWidth - divMidPoint;
        var percentShiftLeft = (leftEdgeLabelFromWindow - numPixelsToShift) / window.innerWidth * 100;
        label.style.left = percentShiftLeft + '%';
      }
    }
  }]);

  return CalendarPrinter;
}(Printer);

var TaskPrinter = function (_Printer2) {
  _inherits(TaskPrinter, _Printer2);

  function TaskPrinter(calendarPrinter, schedule) {
    _classCallCheck(this, TaskPrinter);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskPrinter).call(this));

    _this2.calendarPrinter = calendarPrinter;
    _this2.schedule = schedule;
    _this2.divClassName = 'taskDiv';
    _this2.labelClassName = 'taskDivLabel';
    return _this2;
  }

  _createClass(TaskPrinter, [{
    key: 'printAllTasks',
    value: function printAllTasks() {
      for (var i = 0; i < this.schedule.tasks.length; i++) {
        var task = this.schedule.tasks[i];
        this.printTask(task);
      }
    }
  }, {
    key: 'printTask',
    value: function printTask(task) {
      var taskDivStyle = {
        width: '100px',
        color: 'white',
        left: '100px'
      };
      var targetDurationStyle = {
        width: '50px',
        color: 'red',
        left: '0px'
      };
      var delayDurationStyle = {
        width: '50px',
        color: 'green',
        left: '50px'
      };

      var ganttChart = document.getElementById('gantt_Chart');
      var containingDiv = this.createDiv(ganttChart, 'taskDiv', taskDivStyle);
      var targetDuration = this.createDiv(containingDiv, 'taskDivChild', targetDurationStyle);
      var delayDuration = this.createDiv(containingDiv, 'taskDivChild', delayDurationStyle);
    }
  }, {
    key: 'addCalendarBlocksToTasks',
    value: function addCalendarBlocksToTasks() {
      for (var i = 0; i < this.schedule.tasks.length; i++) {
        var task = this.schedule.tasks[i];
        var calendarBlocksToAdd = this.createArrayOfBlocksInTask(task);
        task.setCalendarBlocksInTask(calendarBlocksToAdd);
        console.log(task);
      }
    }
  }, {
    key: 'createArrayOfBlocksInTask',
    value: function createArrayOfBlocksInTask(task) {
      var array = [];
      for (var i = 0; i < this.calendarPrinter.calendarBlocks.length; i++) {
        var calendarBlock = this.calendarPrinter.calendarBlocks[i];
        if (this.checkIfBlockIsInTask(task, calendarBlock)) {
          array.push(calendarBlock);
        }
      }
      return array;
    }
  }, {
    key: 'checkIfBlockIsInTask',
    value: function checkIfBlockIsInTask(task, calendarBlock) {
      var taskStartDateMs = task.startDate.getTime();
      var taskEndDateMs = task.endDate.getTime();
      var cbStartDateMS = calendarBlock.startDate.getTime();
      var cbEndDateMs = calendarBlock.endDate.getTime();
      if (taskEndDateMs < cbStartDateMS || taskStartDateMs > cbEndDateMs) {
        return false;
      }
      return true;
    }
  }]);

  return TaskPrinter;
}(Printer);

var CalendarBlock = function () {
  function CalendarBlock(div, startDate, endDate) {
    _classCallCheck(this, CalendarBlock);

    this.element = div;
    this.startDate = startDate;
    this.endDate = endDate;
    this.tasksInBlock = [];
  }

  _createClass(CalendarBlock, [{
    key: 'setTasksInBlock',
    value: function setTasksInBlock(array) {
      this.tasksInBlock = array;
    }
  }]);

  return CalendarBlock;
}();

var TaskAdder = function () {
  function TaskAdder(schedule) {
    _classCallCheck(this, TaskAdder);

    this.name;
    this.duration;
    this.startDate;
    this.endDate;
    this.parents = [];
    this.task;
    this.schedule = schedule;
    this.nameField = document.getElementById('taskName');
    this.durationField = document.getElementById('targetDuration');
    this.startDateField = document.getElementById('startDate');
    this.parentsField = document.getElementById('parentTaskList');
  }

  _createClass(TaskAdder, [{
    key: 'addNewTaskToSchedule',
    value: function addNewTaskToSchedule(e) {
      if (e) e.preventDefault();
      this.getDataFromForm();
      this.calculateEndDate();
      this.createTask();
      this.schedule.addTaskToSchedule(this.task);
      this.clearForm();
    }
  }, {
    key: 'getDataFromForm',
    value: function getDataFromForm() {
      this.name = this.nameField.value;
      this.duration = Number(this.durationField.value);
      this.startDate = new Date(this.startDateField.value.replace(/-/g, '/'));
      this.parents = this.parentsField.value.split(',');
    }
  }, {
    key: 'calculateEndDate',
    value: function calculateEndDate() {
      var MilisecondsPerDay = 86400000;
      var startDateInMs = this.startDate.getTime();
      var durationInMs = this.duration * MilisecondsPerDay;
      var endDateInMs = startDateInMs + durationInMs;
      this.endDate = new Date(endDateInMs);
    }
  }, {
    key: 'createTask',
    value: function createTask() {
      this.task = new Task(this.name, [], [], this.startDate, this.endDate);
    }
  }, {
    key: 'clearForm',
    value: function clearForm() {
      this.nameField.value = '';
      this.durationField.value = '';
      this.startDateField.value = '';
      this.parentsField.value = '';
    }
  }]);

  return TaskAdder;
}();

var TaskOrganizer = function () {
  function TaskOrganizer(schedule) {
    _classCallCheck(this, TaskOrganizer);

    this.schedule = schedule;
    this.organizedTasks = [];
  }

  _createClass(TaskOrganizer, [{
    key: 'groupTaskFamilies',
    value: function groupTaskFamilies() {
      for (var i = 0; i < this.schedule.tasks.length; i++) {
        var task = this.schedule.tasks[i];
        if (!task.masterParent) {
          //task is root level, check all of its children tasks
          this.addTaskToOrganizedList(task);
        }
      }
    }
  }, {
    key: 'addTaskToOrganizedList',
    value: function addTaskToOrganizedList(task) {
      this.organizedTasks.push(task);
      this.checkAllChildren(task);
    }
  }, {
    key: 'checkAllChildren',
    value: function checkAllChildren(task) {
      for (var i = 0; i < task.children.length; i++) {
        var child = task.children[i];
        if (child.masterParent === task) {
          this.addTaskToOrganizedList(child);
        }
      }
    }
  }, {
    key: 'updateSchedule',
    value: function updateSchedule() {
      this.schedule.replaceTasksWithOrganized(this.organizedTasks);
    }
  }]);

  return TaskOrganizer;
}();
////////////////////////////////////////////////////////////////////////////////
//Main Code
////////////////////////////////////////////////////////////////////////////////


var systemIdGenerator = new SystemIdGenerator();
var calendarPrinter = new CalendarPrinter();
var schedule = new Schedule();
var taskAdder = new TaskAdder(schedule);

calendarPrinter.printCalendar();

window.addEventListener('resize', calendarPrinter.assignLabelPosition, false);

var btn = document.getElementById('submitTask');
btn.addEventListener('click', function (e) {
  taskAdder.addNewTaskToSchedule(e);
}, false);
////////////////////////////////////////////////////////////////////////////////
//Test Suite
////////////////////////////////////////////////////////////////////////////////
function runAllTests() {
  TaskTestSuite.runAllTaskTests();
  console.log(' ');
  ScheduleTestSuite.runAllScheduleTests();
  console.log(' ');
  SystemIdGeneratorTestSuite.runAllSystemIdGeneratorTests();
  console.log(' ');
  CalendarPrinterTestSuite.runAllCalendarPrinterTests();
  console.log(' ');
  TaskPrinterTestSuite.runAllTaskPrinterTests();
  console.log(' ');
  PrinterTestSuite.runAllPrinterTests();
  console.log(' ');
  TaskAdderTestSuite.runAllTaskAdderTests();
  console.log(' ');
  taskOrganizerTestSuite.runAllTaskOrganizerTests();
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
    runTest(this.testChangeStartDate(), 'changeStartDate');
    runTest(this.testChangeEndDate(), 'changeEndDate');
    runTest(this.testChangeDelayDays(), 'changeDelayDays');
    runTest(this.testGetId(), 'getID');
    runTest(this.testRemoveParent(), 'removeParent');
    runTest(this.testGetStartDate(), 'getStartDate');
    runTest(this.testGetEndDate(), 'getEndDate');
    runTest(this.testSetMasterParent(), 'setMasterParent');
    runTest(this.testGetMasterParent(), 'getMasterParent');
  },

  testAddingTask: function testAddingTask() {
    this.setUp();

    if (this.parent.constructor.prototype.constructor === Task) return true;
    return false;
  },

  testAddParent: function testAddParent() {
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

  testSetMasterParent: function testSetMasterParent() {
    this.setUp();
    var parent2 = new Task('p2', [], []);
    var masterParent = new Task('master', [], []);
    masterParent.changeEndDate(new Date(2016, 0, 0));
    this.parent.changeEndDate(new Date(2015, 0, 0));
    parent2.changeEndDate(new Date(2014, 0, 0));

    this.child.addParent(parent2);
    this.child.addParent(masterParent);

    this.child.setMasterParent();

    if (this.child.masterParent === masterParent) return true;
    return false;
  },

  testGetMasterParent: function testGetMasterParent() {
    this.setUp();
    var masterParent = new Task('master', [], []);
    this.child.addParent(masterParent);

    this.child.setMasterParent();

    var childsMasterParent = this.child.getMasterParent();
    if (childsMasterParent === masterParent) return true;
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

  testGetStartDate: function testGetStartDate() {
    this.parent.changeStartDate(new Date(2016, 11, 25));
    var date = this.parent.getStartDate();

    if (date.getTime() === this.parent.startDate.getTime()) return true;
    return false;
  },

  testGetEndDate: function testGetEndDate() {
    this.parent.changeEndDate(new Date(2016, 11, 25));
    var date = this.parent.getEndDate();

    if (date.getTime() === this.parent.endDate.getTime()) return true;
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

var CalendarPrinterTestSuite = {
  cp: new CalendarPrinter(),

  runAllCalendarPrinterTests: function runAllCalendarPrinterTests() {
    console.log('Calendar Printer Test Suite: ');
  }
};

var TaskPrinterTestSuite = {
  taskPrinter: null,
  taskAdder: null,

  runAllTaskPrinterTests: function runAllTaskPrinterTests() {
    console.log('Task Printer Test Suite: ');
    runTest(this.testPrintTask(), 'Print Task');
    runTest(this.testAddTasksToCalendarBlocks(), 'add tasks to calendarBlocks');
  },

  testPrintTask: function testPrintTask() {
    this.setUp();
  },

  testAddTasksToCalendarBlocks: function testAddTasksToCalendarBlocks() {
    this.setUp();
    this.taskPrinter.addCalendarBlocksToTasks();
  },

  setUp: function setUp() {
    var schedule = new Schedule();
    this.taskPrinter = new TaskPrinter(calendarPrinter, schedule);
    this.taskAdder = new TaskAdder(schedule);
    this.createMockTasks();
  },

  createMockTasks: function createMockTasks() {
    for (var i = 0; i < 5; i++) {
      this.taskAdder.name = i;
      this.taskAdder.startDate = new Date(2016, i, 1);
      this.taskAdder.endDate = new Date(2016, 10, 5);
      this.taskAdder.createTask();
      this.taskAdder.schedule.addTaskToSchedule(this.taskAdder.task);
    }
  }
};

var PrinterTestSuite = {
  printer: new Printer(),

  runAllPrinterTests: function runAllPrinterTests() {
    console.log('Printer Test Suite: ');
    runTest(this.testConvertMonthToDays(), 'convertMonth');
    runTest(this.testConvertWeekToDays(), 'convertWeek');
    runTest(this.testConvertDayToDays(), 'convertDay');
  },

  testConvertMonthToDays: function testConvertMonthToDays() {
    this.printer.units = 'month';
    this.printer.startDate = new Date(2015, 0, 3);
    this.printer.numberOfUnitsToDisplay = 12;

    var numDaysNoLeap = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);
    this.printer.startDate = new Date(2000, 0, 0);
    var numDaysIsLeap = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if (numDaysNoLeap === 365 && numDaysIsLeap === 366) return true;
    return false;
  },

  testConvertWeekToDays: function testConvertWeekToDays() {
    this.printer.units = 'week';
    this.printer.numberOfUnitsToDisplay = 52;

    var numDays = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if (numDays === 364) return true;
    return false;
  },

  testConvertDayToDays: function testConvertDayToDays() {
    this.printer.units = 'day';
    this.printer.numberOfUnitsToDisplay = 400;

    var numDays = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if (numDays === 400) return true;
    return false;
  }
};

var TaskAdderTestSuite = {
  taskAdder: new TaskAdder(new Schedule()),

  setUp: function setUp() {
    this.taskAdder = new TaskAdder(new Schedule());
    this.name = document.getElementById('taskName').value = 'test';
    this.duration = document.getElementById('targetDuration').value = '5';
    this.startDate = document.getElementById('startDate').value = '2016-08-02';
    this.parents = document.getElementById('parentTaskList').value = '1,2,3,44,5';
  },

  cleanUp: function cleanUp() {
    document.getElementById('taskName').value = '';
    document.getElementById('targetDuration').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('parentTaskList').value = '';
    this.name = this.duration = this.startDate = this.parents = null;
  },

  runAllTaskAdderTests: function runAllTaskAdderTests() {
    console.log('Task Adder Test Suite:');
    runTest(this.testAddNewTaskToSchedule(), 'Add new task to schedule');
    runTest(this.testGetDataFromForm(), 'get Data From Form');
    runTest(this.testCalculateEndDate(), 'Calculate endDate');
  },

  testAddNewTaskToSchedule: function testAddNewTaskToSchedule() {
    this.setUp();
    this.taskAdder.addNewTaskToSchedule();
    this.cleanUp();

    if (this.taskAdder.schedule.tasks[0] instanceof Task) return true;
    return false;
  },

  testGetDataFromForm: function testGetDataFromForm() {
    this.setUp();
    this.taskAdder.getDataFromForm();
    var testPass = false;

    if (this.name === 'test' && this.startDate === '2016-08-02' && this.duration === '5' && this.parents == [1, 2, 3, 44, 5]) testPass = true;

    this.cleanUp();
    return testPass;
  },

  testCalculateEndDate: function testCalculateEndDate() {
    this.setUp();
    this.taskAdder.startDate = new Date(2016, 0, 1);
    this.taskAdder.duration = 366;
    this.cleanUp();

    this.taskAdder.calculateEndDate();

    if (this.taskAdder.endDate.getTime() == new Date(2017, 0, 1).getTime()) return true;
    return false;
  }
};

var TaskOrganizerTestSuite = function () {
  function TaskOrganizerTestSuite(schedule) {
    _classCallCheck(this, TaskOrganizerTestSuite);

    this.taskAdder = new TaskAdder(schedule);
    this.taskOrganizer = new TaskOrganizer(schedule);
  }

  _createClass(TaskOrganizerTestSuite, [{
    key: 'runAllTaskOrganizerTests',
    value: function runAllTaskOrganizerTests() {
      console.log('Task Organizer Test Suite:');
      runTest(this.testGroupTaskFamilies(), 'Group Task Families');
      runTest(this.testUpdateSchedule(), 'Update Schedule');
    }
  }, {
    key: 'testGroupTaskFamilies',
    value: function testGroupTaskFamilies() {
      this.setUp();
      this.taskOrganizer.groupTaskFamilies();

      var results = this.getResults(this.taskOrganizer.organizedTasks);

      if (this.compareArrays(results, [4, 3, 2, 1, 0])) return true;
      return false;
    }
  }, {
    key: 'testUpdateSchedule',
    value: function testUpdateSchedule() {
      this.setUp();
      this.taskOrganizer.groupTaskFamilies();
      this.taskOrganizer.updateSchedule();

      var results = this.getResults(this.taskOrganizer.schedule.tasks);

      if (this.compareArrays(results, [4, 3, 2, 1, 0])) return true;
      return false;
    }
  }, {
    key: 'setUp',
    value: function setUp() {
      var freshSchedule = new Schedule();
      this.taskAdder = new TaskAdder(freshSchedule);
      this.taskOrganizer = new TaskOrganizer(freshSchedule);
      this.createMockTasks();
      this.assignLineage();
    }
  }, {
    key: 'createMockTasks',
    value: function createMockTasks() {
      for (var i = 0; i < 5; i++) {
        this.taskAdder.name = i;
        this.taskAdder.startDate = new Date(2016, i, 1);
        this.taskAdder.endDate = new Date(2016, i, 5);
        this.taskAdder.createTask();
        this.taskAdder.schedule.addTaskToSchedule(this.taskAdder.task);
      }
    }
  }, {
    key: 'assignLineage',
    value: function assignLineage() {
      var taskList = this.taskAdder.schedule;
      var task0 = taskList.tasks[0];
      var task1 = taskList.tasks[1];
      var task2 = taskList.tasks[2];
      var task3 = taskList.tasks[3];
      var task4 = taskList.tasks[4];

      task0.addParent(task1);
      task1.addParent(task2);
      task2.addParent(task3);
      task3.addParent(task4);

      task0.setMasterParent();
      task1.setMasterParent();
      task2.setMasterParent();
      task3.setMasterParent();
    }
  }, {
    key: 'getResults',
    value: function getResults(arr) {
      var results = [];
      for (var i = 0; i < arr.length; i++) {
        results[i] = arr[i].name;
      }
      return results;
    }
  }, {
    key: 'compareArrays',
    value: function compareArrays(arr1, arr2) {
      if (arr1.length != arr2.length) return false;
      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
      }
      return true;
    }
  }]);

  return TaskOrganizerTestSuite;
}();

var taskOrganizerTestSuite = new TaskOrganizerTestSuite(new Schedule());

runAllTests();