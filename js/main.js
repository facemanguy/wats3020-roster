/* JS for WATS 3020 Roster Project */

//Define person and its variations to fill entries in our roster
//Calculate individual attendance of students to display
class Person {
    constructor(name, email){
        this.name = name;
        this.email = email;
        this.username = email.split('@')[0]; //defaults username to email identifier
    }
}

class Student extends Person{
    constructor(name, email){
        super(name, email);
        this.attendance = [];
    }
    calculateAttendance(){
        if (this.attendance.length > 0){
            let counter = 0;
            for (let mark of this.attendance){
                counter += mark;
            }
            let attendancePercent = (counter / this.attendance.length) * 100;
            return `${attendancePercent.toFixed(2)}%`;
        }else{
            return '0%';
        }
    }
    calculateDays(){
        if (this.attendance.length > 0){
            let count = 0;
        for (let marks of this.attendance){
            count += marks;
        }
        let days = (count);
        return `${days} / ${this.attendance.length}`;
        }else{
            return 0;
        }
    }
}

class Teacher extends Person{
    constructor(name, email, honorific){
        super(name, email);
        this.honorific = honorific;
    }
}

//Course sets up modifications to our roster such as additional students
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    
    addStudent(){
        let name = prompt("Enter student full name:","Al Capone");
        let email = prompt("Enter student email:","gangster@totallylegal.com");
        let newStudent = new Student(name, email);
        this.students.push(newStudent);
        updateRoster(this);
    }

    
    setTeacher(){
        let name = prompt("Enter full name of Teacher:","Big Stan");
        let email = prompt("Enter Email of teacher:","daboss@totallylegal.com");
        let honorific = prompt("Enter Honorific:","Prof.");
        this.teacher = new Teacher(name, email, honorific);
        updateRoster(this);
    }

   
    markAttendance(username, status = "present"){
        let foundStudent = this.findStudent(username);
        if (status === "present"){
            foundStudent.attendance.push(1);
        }else{
            foundStudent.attendance.push(0);
        }
        updateRoster(this);
    }


    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}


let courseCode = prompt("Enter the course code:","FIN 101");
let courseTitle = prompt("Enter the course title:","Finance 101");
let courseDescription = prompt("Enter the course description:","Money Making for Beginners");
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let daysTD = document.createElement('td');
        daysTD.innerHTML = student.calculateDays();
        newTR.appendChild(daysTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}

