USE `grader`;

CREATE TABLE courses (
    cid SERIAL not null,
    ccode char(6) not null,
    cname varchar(50) not null,
    semester char(1),
    year char(4),
    primary key (cid)
);


CREATE TABLE students (
    username varchar(16) not null,
    password varchar(100) not null,
    studentid char(9),
    fullname varchar(100),
    primary key (username)
);

CREATE TABLE students_in_courses (
    username varchar(16) not null references students (username),
    cid integer not null references courses (cid),
    PRIMARY KEY(username, cid)
);

CREATE TABLE assignment_header (
    anumber integer not null,
    aname varchar(100) not null,
    noofquestion integer not null,
    startdate timestamp,
    duedate timestamp,
    dbid integer not null,
    totalscore integer,
    astatus varchar(10) not null,
    cid integer not null,
    primary key (anumber),
    foreign key (dbid) references databases (dbid),
     foreign key (cid) references course (cid)
);

CREATE TABLE question_detail (
    qid SERIAL not null,
    qnumber integer not null,
    anumber integer not null,
    qdescription varchar(200),
    testcasefile varchar(200),
    score integer not null,
    primary key (qid),
    foreign key (anumber) references assignment_header (anumber)
);

