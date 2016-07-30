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
  }]);

  return Task;
}();

var Printer = function () {
  function Printer() {
    _classCallCheck(this, Printer);

    this.units = 'month';
    this.numberOfUnitsToDisplay = 24;
    this.startDate = new Date(2016, 0, 1);
    this.endDate;
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
      this.calendarBlocks.push(this.createDiv(style));
      var indexOfDiv = this.calendarBlocks.length - 1;
      var div = this.calendarBlocks[indexOfDiv];
      this.createLabelFor(div, date);
    }
  }, {
    key: 'createDiv',
    value: function createDiv(style) {
      var div = document.createElement('div');
      var parent = document.getElementById('gantt_Chart');
      div.setAttribute('class', 'calendarUnitBlock');
      div.style.backgroundColor = style.color;
      div.style.width = style.width;
      parent.appendChild(div);
      return div;
    }
  }, {
    key: 'createLabelFor',
    value: function createLabelFor(div, date) {
      var label = document.createElement('label');
      label.setAttribute('class', 'calendarUnitBlockLabel');
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var labelDate = document.createTextNode(month + "/" + day + "/" + year);
      label.appendChild(labelDate);
      div.appendChild(label);
    }
  }, {
    key: 'getNewCalendarDate',
    value: function getNewCalendarDate(oldDate) {
      var MilisecondsPerDay = 86400000;
      var numDays = this.convertUnitsToDays(1, oldDate);
      var numMsInDays = numDays * MilisecondsPerDay;
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

  function TaskPrinter() {
    _classCallCheck(this, TaskPrinter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TaskPrinter).call(this));
  }

  return TaskPrinter;
}(Printer);
////////////////////////////////////////////////////////////////////////////////
//Main Code
////////////////////////////////////////////////////////////////////////////////


var systemIdGenerator = new SystemIdGenerator();
var calendarPrinter = new CalendarPrinter();
calendarPrinter.printCalendar();

window.addEventListener('resize', calendarPrinter.assignLabelPosition, false);
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
  tp: new TaskPrinter(),

  runAllTaskPrinterTests: function runAllTaskPrinterTests() {
    console.log('Task Printer Test Suite: ');
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
runAllTests();