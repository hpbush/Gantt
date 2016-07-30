class SystemIdGenerator{
  constructor(id){
    this.masterId = id || 0;
  }

  assignId(){
    return this.masterId++;
  }
}

class Schedule{
  constructor(projectStartDate, projectEndDate){
    this.tasks = [];
    this.projectStartDate = projectStartDate;
    this.projectEndDate = projectEndDate;
  }

  addTaskToSchedule(task){
    this.tasks.push(task);
  }
}

class Task{
  constructor(name, children, parents, startDate, endDate){
    this.name = name;
    this.children = children;
    this.parents = parents;
    this.masterParent;
    this.startDate = startDate;
    this.endDate = endDate;
    this.delayDays = 0;
    this.id = systemIdGenerator.assignId();
  }

  addParent(parent){
    this.parents.push(parent);
    parent.children.push(this);
  }

  removeParent(parent){
    let indexOfParent = this.parents.indexOf(parent);
    let indexOfChild = parent.children.indexOf(this);
    this.parents.splice(indexOfParent, 1);
    parent.children.splice(indexOfChild,1);
  }

  setMasterParent(){
    if(this.parents.length > 0){
      let MPcandidate = this.parents[0];
      let laregestEndDateFound = MPcandidate.endDate;
      for(let i = 1; i < this.parents.length; i++){
        let dateBeingChecked = this.parents[i].endDate;
        if(dateBeingChecked > laregestEndDateFound){
          MPcandidate = this.parents[i];
        }
      }
      this.masterParent = MPcandidate;
    }
  }

  getMasterParent(){
    return this.masterParent;
  }

  changeName(newName){
    this.name = newName;
  }

  changeDelayDays(newDelay){
    this.delayDays = newDelay;
  }

  changeStartDate(newStartDate){
    this.startDate = newStartDate;
  }

  changeEndDate(newEndDate){
    this.endDate = newEndDate;
  }

  getStartDate(){
    return this.startDate;
  }

  getEndDate(){
    return this.endDate;
  }

  getId(){
    return this.id;
  }
}

class Printer{
  constructor(){
    this.units = 'month';
    this.numberOfUnitsToDisplay = 24;
    this.startDate = new Date(2016, 0, 1);
    this.endDate;
  }

  convertUnitsToDays(numberOfUnits, startDate){
    switch(this.units){
      case 'day':
        return numberOfUnits;
      case 'week':
        return numberOfUnits*7;
      case 'month':
        return this.convertMonthsToDays(numberOfUnits, startDate);
      default:
        return numberOfUnits;
    }
  }

  convertMonthsToDays(numberOfUnits, startDate){
    let currentMonth = startDate.getMonth() - 1;
    let currentYear = startDate.getFullYear();
    let totalNumberOfDays = 0;
    for(let i = 0; i < numberOfUnits; i++){
      currentMonth++;
      if(currentMonth > 11){
        currentMonth = 0;
        currentYear++;
      }
      totalNumberOfDays += this.daysInMonth(currentMonth, currentYear)
    }
    return totalNumberOfDays;
  }

  daysInMonth(month, year){
    switch(month){
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

  leapYear(year){
    if(((year % 4 == 0) && (year % 100 != 0))  || (year % 400 == 0))
      return 1;
    return 0;
  }

}

class CalendarPrinter extends Printer{
  constructor(){
    super();
    this.primaryColor = '#999';
    this.secondaryColor = '#eee';
    this.calendarBlocks = [];
  }

  printCalendar(){
    let date = this.startDate;
    for(let i = 0; i < this.numberOfUnitsToDisplay; i++){
      this.createCalendarBlock(i, date);
      date = this.getNewCalendarDate(date);
    }
    this.assignLabelPosition();
  }

  createCalendarBlock(currentBlock, date){
    let style = {
      width: 100 / this.numberOfUnitsToDisplay + '%',
      color: this.secondaryColor
    }
    if(currentBlock%2 === 0){
      style.color = this.primaryColor;
    }
    this.calendarBlocks.push(this.createDiv(style));
    let indexOfDiv = this.calendarBlocks.length-1;
    let div = this.calendarBlocks[indexOfDiv];
    this.createLabelFor(div, date);
  }

  createDiv(style){
    let div = document.createElement('div');
    let parent = document.getElementById('gantt_Chart');
    div.setAttribute('class', 'calendarUnitBlock');
    div.style.backgroundColor = style.color;
    div.style.width = style.width;
    parent.appendChild(div);
    return div;
  }

  createLabelFor(div, date){
    let label = document.createElement('label');
    label.setAttribute('class', 'calendarUnitBlockLabel')
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let labelDate = document.createTextNode(month + "/" + day + "/" + year);
    label.appendChild(labelDate);
    div.appendChild(label);
  }

  getNewCalendarDate(oldDate){
    const MilisecondsPerDay = 86400000;
    let numDays = this.convertUnitsToDays(1, oldDate);
    let numMsInDays = numDays * MilisecondsPerDay;
    let numMsInDate = oldDate.getTime();
    let newDateTotalMs = numMsInDays + numMsInDate;
    return new Date(newDateTotalMs);
  }

  assignLabelPosition(){
    let divList = document.querySelectorAll('.calendarUnitBlock');
    let halfDivWidth = (divList[0].getBoundingClientRect().width) / 2;
    for(let i = 0; i < divList.length; i++){
      let label = divList[i].firstChild;
      let labelWidth = label.getBoundingClientRect().width;
      let leftEdgeDivFromWindow = divList[i].getBoundingClientRect().left;
      let leftEdgeLabelFromWindow = label.getBoundingClientRect().left;
      let divMidPoint = leftEdgeDivFromWindow + halfDivWidth;
      let numPixelsToShift = leftEdgeLabelFromWindow + labelWidth - divMidPoint;
      let percentShiftLeft = ((leftEdgeLabelFromWindow - numPixelsToShift) / window.innerWidth) * 100;
      label.style.left = percentShiftLeft + '%';
    }
  }
}

class TaskPrinter extends Printer{
  constructor(){
    super();
  }
}
////////////////////////////////////////////////////////////////////////////////
//Main Code
////////////////////////////////////////////////////////////////////////////////
let systemIdGenerator = new SystemIdGenerator();
let calendarPrinter = new CalendarPrinter();
calendarPrinter.printCalendar();

window.addEventListener('resize', calendarPrinter.assignLabelPosition, false);
////////////////////////////////////////////////////////////////////////////////
//Test Suite
////////////////////////////////////////////////////////////////////////////////
function runAllTests(){
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

function runTest(testPass, testName){
  if(testPass)
    console.log('  ' + testName + ": Pass");
  else
    console.log('   ' + testName + ": Fail");
}

let TaskTestSuite = {
  parent: new Task('parent', [], []),
  child: new Task('child', [], []),

  runAllTaskTests: function(){
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
    runTest(this.testSetMasterParent(),'setMasterParent');
    runTest(this.testGetMasterParent(), 'getMasterParent');
  },

  testAddingTask: function(){
    this.setUp();

    if(this.parent.constructor.prototype.constructor === Task)
      return true;
    return false;
  },

  testAddParent: function(){
    this.setUp();

    this.child.addParent(this.parent);

    if(this.parent.children[0] === this.child && this.child.parents[0] === this.parent)
      return true;
    return false;
  },

  testRemoveParent: function(){
    this.setUp();
    this.child.addParent(this.parent);

    this.child.removeParent(this.parent);

    if(this.child.parents.length === 0 && this.parent.children.length === 0)
      return true;
    return false;
  },

  testSetMasterParent: function(){
    this.setUp();
    let parent2 = new Task('p2', [], []);
    let masterParent = new Task('master', [], []);
    masterParent.changeEndDate(new Date(2016,0,0));
    this.parent.changeEndDate(new Date(2015,0,0));
    parent2.changeEndDate(new Date(2014,0,0));

    this.child.addParent(parent2);
    this.child.addParent(masterParent);

    this.child.setMasterParent();

    if(this.child.masterParent === masterParent)
      return true;
    return false;
  },

  testGetMasterParent: function(){
    this.setUp();
    let masterParent = new Task('master', [], []);
    this.child.addParent(masterParent);

    this.child.setMasterParent();

    let childsMasterParent = this.child.getMasterParent();
    if(childsMasterParent === masterParent)
      return true;
    return false;
  },

  testChangeStartDate: function(){
    this.parent.changeStartDate(new Date(2016,11,25));

    if(this.parent.startDate.getTime() === new Date(2016,11,25).getTime())
      return true;
    return false;
  },

  testChangeEndDate: function(){
    this.parent.changeEndDate(new Date(2016,11,25));

    if(this.parent.endDate.getTime() === new Date(2016,11,25).getTime())
      return true;
    return false;
  },

  testGetStartDate: function(){
    this.parent.changeStartDate((new Date(2016,11,25)));
    let date = this.parent.getStartDate();

    if(date.getTime() === this.parent.startDate.getTime())
      return true;
    return false;
  },

  testGetEndDate: function(){
    this.parent.changeEndDate((new Date(2016,11,25)));
    let date = this.parent.getEndDate();

    if(date.getTime() === this.parent.endDate.getTime())
      return true;
    return false;
  },

  testChangeDelayDays: function(){
    this.parent.changeDelayDays(2);

    if(this.parent.delayDays === 2)
      return true;
    return false;
  },

  testGetId: function(){
    let id = this.parent.getId();

    if(this.parent.id === id)
      return true;
    return false;
  },

  setUp: function(){
    this.parent = new Task('parent', [], []);
    this.child = new Task('child', [], []);
  }
}

let ScheduleTestSuite = {
  schedule: new Schedule(new Date(2016, 0, 0), new Date(2016, 0 ,1)),

  runAllScheduleTests: function(){
    console.log('Schedule Test Suite: ')
    runTest(this.testAddTaskToSchedule(), 'addTaskToSchedule');
  },

  testAddTaskToSchedule: function(){
    this.schedule.addTaskToSchedule(new Task('test',[],[]));

    if(this.schedule.tasks[0].name === 'test')
      return true;
    return false;
  },

  testRemoveTaskFromSchedule: function(){
    this.schedule.addTaskToSchedule(new Task('test1',[],[]));
    this.schedule.addTaskToSchedule(new Task('test2',[],[]));
    this.schedule.addTaskToSchedule(new Task('test3',[],[]));

    this.schedule.removeTaskFromSchedule()
  }
}

let SystemIdGeneratorTestSuite = {
  systemIdGen: new SystemIdGenerator(),

  runAllSystemIdGeneratorTests: function(){
    console.log('System Id Generator Test Suite: ');
    runTest(this.testAssignId(), 'assign ID');
  },

  testAssignId: function(){
    this.systemIdGen.assignId();

    if(this.systemIdGen.masterId === 1)
      return true;
    return false;
  }
}

let CalendarPrinterTestSuite = {
  cp: new CalendarPrinter,

  runAllCalendarPrinterTests: function(){
    console.log('Calendar Printer Test Suite: ');
  }
}

let TaskPrinterTestSuite = {
  tp: new TaskPrinter,

  runAllTaskPrinterTests: function(){
    console.log('Task Printer Test Suite: ');
  }

}

let PrinterTestSuite = {
  printer: new Printer,

  runAllPrinterTests: function(){
    console.log('Printer Test Suite: ');
    runTest(this.testConvertMonthToDays(), 'convertMonth');
    runTest(this.testConvertWeekToDays(), 'convertWeek');
    runTest(this.testConvertDayToDays(), 'convertDay');
  },

  testConvertMonthToDays: function(){
    this.printer.units = 'month';
    this.printer.startDate = new Date(2015,0,3);
    this.printer.numberOfUnitsToDisplay = 12;

    let numDaysNoLeap = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);
    this.printer.startDate = new Date(2000,0,0);
    let numDaysIsLeap = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if(numDaysNoLeap === 365 && numDaysIsLeap === 366)
      return true;
    return false;
  },

  testConvertWeekToDays: function(){
    this.printer.units = 'week';
    this.printer.numberOfUnitsToDisplay = 52;

    let numDays = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if(numDays === 364)
      return true;
    return false;
  },

  testConvertDayToDays: function(){
    this.printer.units = 'day';
    this.printer.numberOfUnitsToDisplay = 400;

    let numDays = this.printer.convertUnitsToDays(this.printer.numberOfUnitsToDisplay, this.printer.startDate);

    if(numDays === 400)
      return true;
    return false;
  }
}
runAllTests();
