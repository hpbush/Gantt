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

  replaceTasksWithOrganized(tasks){
    this.tasks = tasks
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
    this.calendarBlocks = [];
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

  setCalendarBlocksInTask(calendarBlockArr){
    this.calendarBlocks = calendarBlockArr;
  }

  getCalendarBlocks(){
    return this.calendarBlocks;
  }
}

class Printer{
  constructor(){
    this.units = 'month';
    this.numberOfUnitsToDisplay = 10;
    this.startDate = new Date(2016, 0, 1);
    this.endDate;
    this.labelClassName;
    this.MilisecondsPerDay = 86400000;
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

  createDiv(parent, className, style){
    let div = document.createElement('div');
    div.setAttribute('class', className);
    div.style.backgroundColor = style.color;
    div.style.width = style.width;
    if(style.left){
      div.style.left = style.left;
    }
    parent.appendChild(div);
    return div;
  }

  createLabelFor(div, content){
    let label = document.createElement('label');
    label.setAttribute('class', this.labelClassName);
    let labelContent = document.createTextNode(content);
    label.appendChild(labelContent);
    div.appendChild(label);
  }

}

class CalendarPrinter extends Printer{
  constructor(){
    super();
    this.primaryColor = '#999';
    this.secondaryColor = '#eee';
    this.divClassName = 'calendarUnitBlock';
    this.labelClassName = 'calendarUnitBlockLabel';
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
    let parent = document.getElementById('gantt_Chart');
    let div = this.createDiv(parent, 'calendarUnitBlock', style);

    let labelDate = this.formatDateForLabelText(date);
    this.createLabelFor(div, labelDate);

    let endDateInMsWithExtraDay = this.getNewCalendarDate(date).getTime();
    let endDateInMs = endDateInMsWithExtraDay - this.MilisecondsPerDay;
    let endDate = new Date(endDateInMs);
    let calendarBlock = new CalendarBlock(div, date, endDate);
    this.calendarBlocks.push(calendarBlock);
  }

  formatDateForLabelText(date){
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return (month + "/" + day + "/" + year);
  }

  getNewCalendarDate(oldDate){
    let numDays = this.convertUnitsToDays(1, oldDate);
    let numMsInDays = numDays * this.MilisecondsPerDay;
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
  constructor(calendarPrinter, schedule){
    super();
    this.calendarPrinter = calendarPrinter;
    this.schedule = schedule;
    this.divClassName = 'taskDiv';
    this.labelClassName = 'taskDivLabel';
  }

  printAllTasks(){
    for(let i = 0; i < this.schedule.tasks.length; i++){
      let task = this.schedule.tasks[i];
      this.printTask(task);
    }
  }

  printTask(task){
    let taskDivStyle = {
      width: '100px',
      color: 'white',
      left: '100px'
    };
    let targetDurationStyle = {
      width: '50px',
      color: 'red',
      left: '0px'
    };
    let delayDurationStyle = {
      width: '50px',
      color: 'green',
      left: '50px'
    };

    let ganttChart = document.getElementById('gantt_Chart');
    let containingDiv = this.createDiv(ganttChart, 'taskDiv', taskDivStyle);
    let targetDuration = this.createDiv(containingDiv, 'taskDivChild', targetDurationStyle);
    let delayDuration = this.createDiv(containingDiv, 'taskDivChild', delayDurationStyle);
  }

  addCalendarBlocksToTasks(){
    for(let i = 0; i < this.schedule.tasks.length; i++){
      let task = this.schedule.tasks[i];
      let calendarBlocksToAdd = this.createArrayOfBlocksInTask(task);
      task.setCalendarBlocksInTask(calendarBlocksToAdd);
      console.log(task);
    }
  }

  createArrayOfBlocksInTask(task){
    let array = []
    for(let i = 0; i < this.calendarPrinter.calendarBlocks.length; i++){
      let calendarBlock = this.calendarPrinter.calendarBlocks[i];
      if(this.checkIfBlockIsInTask(task, calendarBlock)){
        array.push(calendarBlock);
      }
    }
    return array;
  }

  checkIfBlockIsInTask(task, calendarBlock){
    let taskStartDateMs = task.startDate.getTime();
    let taskEndDateMs = task.endDate.getTime();
    let cbStartDateMS = calendarBlock.startDate.getTime();
    let cbEndDateMs = calendarBlock.endDate.getTime();
    if(taskEndDateMs < cbStartDateMS || taskStartDateMs > cbEndDateMs){
      return false;
    }
    return true;
  }
}

class CalendarBlock{
  constructor(div, startDate, endDate){
    this.element = div;
    this.startDate = startDate;
    this.endDate = endDate;
    this.tasksInBlock = [];
  }

  setTasksInBlock(array){
    this.tasksInBlock = array;
  }
}
class TaskAdder{
  constructor(schedule){
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

  addNewTaskToSchedule(e){
    if(e)
      e.preventDefault();
    this.getDataFromForm();
    this.calculateEndDate();
    this.createTask();
    this.schedule.addTaskToSchedule(this.task);
    this.clearForm();
  }

  getDataFromForm(){
    this.name = this.nameField.value;
    this.duration = Number (this.durationField.value);
    this.startDate = new Date(this.startDateField.value.replace(/-/g, '/'));
    this.parents = this.parentsField.value.split(',');
  }

  calculateEndDate(){
    const MilisecondsPerDay = 86400000;
    let startDateInMs = this.startDate.getTime();
    let durationInMs = this.duration * MilisecondsPerDay;
    let endDateInMs = startDateInMs + durationInMs;
    this.endDate = new Date(endDateInMs);
  }

  createTask(){
    this.task = new Task(this.name, [], [], this.startDate, this.endDate);
  }

  clearForm(){
    this.nameField.value = '';
    this.durationField.value = '';
    this.startDateField.value = '';
    this.parentsField.value = '';
  }
}

class TaskOrganizer{
  constructor(schedule){
    this.schedule = schedule;
    this.organizedTasks = [];
  }

  groupTaskFamilies(){
    for(let i = 0; i < this.schedule.tasks.length; i++){
      let task = this.schedule.tasks[i];
      if(!task.masterParent){ //task is root level, check all of its children tasks
        this.addTaskToOrganizedList(task);
      }
    }
  }

  addTaskToOrganizedList(task){
    this.organizedTasks.push(task);
    this.checkAllChildren(task);
  }

  checkAllChildren(task){
    for(let i = 0; i < task.children.length; i++){
      let child = task.children[i];
      if(child.masterParent === task){
        this.addTaskToOrganizedList(child);
      }
    }
  }

  updateSchedule(){
    this.schedule.replaceTasksWithOrganized(this.organizedTasks);
  }
}
////////////////////////////////////////////////////////////////////////////////
//Main Code
////////////////////////////////////////////////////////////////////////////////
let systemIdGenerator = new SystemIdGenerator();
let calendarPrinter = new CalendarPrinter();
let schedule = new Schedule();
let taskAdder = new TaskAdder(schedule);

calendarPrinter.printCalendar();

window.addEventListener('resize', calendarPrinter.assignLabelPosition, false);

let btn = document.getElementById('submitTask');
btn.addEventListener('click', function(e){
  taskAdder.addNewTaskToSchedule(e);
},false);
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
  console.log(' ');
  TaskAdderTestSuite.runAllTaskAdderTests();
  console.log(' ');
  taskOrganizerTestSuite.runAllTaskOrganizerTests();
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
  taskPrinter: null,
  taskAdder: null,


  runAllTaskPrinterTests: function(){
    console.log('Task Printer Test Suite: ');
    runTest(this.testPrintTask(), 'Print Task');
    runTest(this.testAddTasksToCalendarBlocks(), 'add tasks to calendarBlocks');
  },

  testPrintTask: function(){
    this.setUp();
  },

  testAddTasksToCalendarBlocks: function(){
    this.setUp();
    this.taskPrinter.addCalendarBlocksToTasks();
  },

  setUp: function(){
    let schedule = new Schedule();
    this.taskPrinter = new TaskPrinter(calendarPrinter, schedule);
    this.taskAdder = new TaskAdder(schedule);
    this.createMockTasks();
  },

  createMockTasks: function(){
    for(let i = 0; i < 5; i++){
      this.taskAdder.name = i;
      this.taskAdder.startDate = new Date(2016,i,1);
      this.taskAdder.endDate = new Date(2016,10,5);
      this.taskAdder.createTask();
      this.taskAdder.schedule.addTaskToSchedule(this.taskAdder.task);
    }
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

let TaskAdderTestSuite = {
  taskAdder: new TaskAdder(new Schedule),

  setUp: function(){
    this.taskAdder = new TaskAdder(new Schedule);
    this.name = document.getElementById('taskName').value = 'test';
    this.duration = document.getElementById('targetDuration').value = '5';
    this.startDate = document.getElementById('startDate').value = '2016-08-02';
    this.parents = document.getElementById('parentTaskList').value = '1,2,3,44,5';
  },

  cleanUp: function(){
    document.getElementById('taskName').value = '';
    document.getElementById('targetDuration').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('parentTaskList').value = '';
    this.name = this.duration = this.startDate = this.parents = null;
  },

  runAllTaskAdderTests: function(){
    console.log('Task Adder Test Suite:');
    runTest(this.testAddNewTaskToSchedule(), 'Add new task to schedule');
    runTest(this.testGetDataFromForm(), 'get Data From Form');
    runTest(this.testCalculateEndDate(), 'Calculate endDate');
  },

  testAddNewTaskToSchedule: function(){
    this.setUp();
    this.taskAdder.addNewTaskToSchedule();
    this.cleanUp();

    if(this.taskAdder.schedule.tasks[0] instanceof Task)
      return true;
    return false;
  },

  testGetDataFromForm: function(){
    this.setUp();
    this.taskAdder.getDataFromForm();
    let testPass = false;

    if(this.name === 'test' && this.startDate === '2016-08-02' && this.duration === '5' && this.parents == [1,2,3,44,5])
      testPass = true;

    this.cleanUp();
    return testPass;
  },

  testCalculateEndDate: function(){
    this.setUp();
    this.taskAdder.startDate = new Date(2016, 0, 1);
    this.taskAdder.duration = 366;
    this.cleanUp();

    this.taskAdder.calculateEndDate();

    if(this.taskAdder.endDate.getTime() == new Date(2017, 0 , 1).getTime())
      return true;
    return false;
  }
}

class TaskOrganizerTestSuite{
  constructor(schedule){
    this.taskAdder = new TaskAdder(schedule);
    this.taskOrganizer = new TaskOrganizer(schedule);
  }

  runAllTaskOrganizerTests(){
    console.log('Task Organizer Test Suite:');
    runTest(this.testGroupTaskFamilies(), 'Group Task Families');
    runTest(this.testUpdateSchedule(), 'Update Schedule');
  }

  testGroupTaskFamilies(){
    this.setUp();
    this.taskOrganizer.groupTaskFamilies();

    let results = this.getResults(this.taskOrganizer.organizedTasks);

    if(this.compareArrays(results, [4,3,2,1,0]))
      return true;
    return false;
  }

  testUpdateSchedule(){
    this.setUp();
    this.taskOrganizer.groupTaskFamilies();
    this.taskOrganizer.updateSchedule();

    let results = this.getResults(this.taskOrganizer.schedule.tasks);

    if(this.compareArrays(results, [4,3,2,1,0]))
      return true;
    return false;
  }

  setUp(){
    let freshSchedule = new Schedule();
    this.taskAdder = new TaskAdder(freshSchedule);
    this.taskOrganizer = new TaskOrganizer(freshSchedule);
    this.createMockTasks();
    this.assignLineage();
  }

  createMockTasks(){
    for(let i = 0; i < 5; i++){
      this.taskAdder.name = i;
      this.taskAdder.startDate = new Date(2016,i,1);
      this.taskAdder.endDate = new Date(2016,i,5);
      this.taskAdder.createTask();
      this.taskAdder.schedule.addTaskToSchedule(this.taskAdder.task);
    }
  }

  assignLineage(){
    let taskList = this.taskAdder.schedule;
    let task0 = taskList.tasks[0];
    let task1 = taskList.tasks[1];
    let task2 = taskList.tasks[2];
    let task3 = taskList.tasks[3];
    let task4 = taskList.tasks[4];

    task0.addParent(task1);
    task1.addParent(task2);
    task2.addParent(task3);
    task3.addParent(task4);

    task0.setMasterParent();
    task1.setMasterParent();
    task2.setMasterParent();
    task3.setMasterParent();
  }

  getResults(arr){
    let results = [];
    for(let i = 0; i < arr.length; i++){
      results[i] = arr[i].name;
    }
    return results;
  }

  compareArrays(arr1, arr2){
    if(arr1.length != arr2.length)
      return false;
    for(let i = 0; i < arr1.length; i++){
      if(arr1[i] != arr2[i])
        return false;
    }
    return true;
  }


}
let taskOrganizerTestSuite = new TaskOrganizerTestSuite(new Schedule);

runAllTests();
