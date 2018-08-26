CREATE DATABASE graderV2;
USE graderV2;

    CREATE TABLE Faculty (
        facultyID integer not null,
        facultyName varchar(100) not null,
        primary key (facultyID)
    );

    CREATE TABLE Major (
        majorID integer not null,
        majorName varchar(100),
        facultyID integer not null,
        primary key (majorID),
        foreign key (facultyID) references Faculty (facultyID)
    );

    CREATE TABLE Subject (
        subjectID integer not null,
        subjectName varchar(100),
        facultyID integer not null,
        primary key (subjectID),
        foreign key (facultyID) references Faculty (facultyID)
    );


    CREATE TABLE Student (
        studentID char(9) not null,
        password varchar(100) not null,
        title varchar(10),
        firstName varchar(50),
        lastName varchar(50),
        email varchar(70),
        facultyID integer not null,
        majorID integer not null,
        primary key (studentID),
        foreign key (facultyID) references Faculty (facultyID),
        foreign key (majorID) references Major (majorID)
    );

    CREATE TABLE Enroll (
        year char(4) not null,
        semester char(1) not null,
        subjectID integer not null,
        studentID char(9) not null,
        section integer,
        primary key (year, semester, studentID, subjectID),
        foreign key (studentID) references Student (studentID),
        foreign key (subjectID) references Subject (subjectID)
    );



    CREATE TABLE SupportedDBMS (
        DBMSID integer not null,
        DBMSName varchar(50),
        primary key (DBMSID)
    );

    CREATE TABLE Assignment (
        year char(4) not null,
        semester integer not null,
        subjectID integer not null,
        assignmentID SERIAL not null,
        title varchar(100) not null,
        startDate timestamp without time zone,
        dueDate timestamp without time zone,
        databaseName varchar(50) not null,
        totalScore numeric DEFAULT 0,
        instruction varchar(50),
        primary key (assignmentID, year ,semester, subjectID),
        foreign key (subjectID) references Subject (subjectID)
    );


    CREATE TABLE Submission (
        year char(4) not null,
        semester integer not null,
        subjectID integer not null,
        studentID char(9) not null,
        assignmentID integer not null,
        submitDateTime timestamp without time zone not null,
        DBMSID integer not null,
        submitTotalScore numeric DEFAULT 0,
        primary key (year, semester, subjectID, studentID, assignmentID, submitDateTime, DBMSID),
        foreign key (subjectID) references Subject (subjectID),
        foreign key (studentID) references Student (studentID),
        foreign key (assignmentID, year, semester, subjectID) references Assignment (assignmentID, year, semester, subjectID),
        foreign key (DBMSID) references supportedDBMS (DBMSID)
    );

    CREATE TABLE AssignmentDBMS (
        year char(4) not null,
        semester integer not null,
        subjectID integer not null,
        DBMSID integer not null,
        primary key (year ,semester, subjectID, DBMSID),
        foreign key (subjectID) references Subject (subjectID),
        foreign key (DBMSID) references supportedDBMS (DBMSID)
    );

    CREATE TABLE QuestionType (
        questionTypeID SERIAL not null,
        questionTypeDesc varchar (50),
        primary key (questionTypeID)
    );


    CREATE TABLE Complication (
        complicationID SERIAL not null,
        complicationDesc varchar (30),
        primary key (complicationID)
    );


    CREATE TABLE ScoreType (
        scoreTypeID SERIAL not null,
        scoreDesc varchar (30) not null,
        scorePercent integer not null,
        primary key (scoreTypeID)
    );


    CREATE TABLE Questions (
        year char(4) not null,
        semester integer not null,
        subjectID integer not null,
        assignmentID integer not null,
        questionID SERIAL not null,
        complicationID integer not null,
        questionTypeID integer not null,
        questionDesc varchar(200),
        testCase varchar(200),
        primary key (year, semester, subjectID, assignmentID,questionID),
        foreign key (subjectID) references Subject (subjectID),
        foreign key (assignmentID, year, semester, subjectID) references Assignment (assignmentID, year, semester, subjectID),
        foreign key (complicationID) references Complication (complicationID),
        foreign key (questionTypeID) references QuestionType (questionTypeID)
    );


        CREATE TABLE SubmissionDetails (
            year char(4) not null,
            semester integer not null,
            subjectID integer not null,
            assignmentID integer not null,
            questionID SERIAL not null,
            studentID char(9) not null,
            scoreTypeID integer not null,
            studentSolution varchar(200),
            primary key (year, semester, subjectID, assignmentID, questionID,studentID, scoreTypeID),
            foreign key (subjectID) references Subject (subjectID),
            foreign key (assignmentID, year, semester, subjectID) references Assignment (assignmentID, year, semester, subjectID),
            foreign key (questionID, year, semester, subjectID, assignmentID) references Questions (questionID, year, semester, subjectID, assignmentID),
            foreign key (studentID) references Student (studentID),
            foreign key (scoreTypeID) references ScoreType (scoreTypeID)
        );

