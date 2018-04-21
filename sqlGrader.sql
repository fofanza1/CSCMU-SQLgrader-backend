USE `grader`;

CREATE TABLE databases (
    dbid SERIAL not null,
    dbname varchar(50),
    primary key (cid)
);

CREATE TABLE courses (
    cid SERIAL not null,
    ccode char(6) not null,
    cname varchar(50) not null,
    semester char(1),
    year char(4),
    cstatus varchar(7),
    primary key (cid)
);

-- INSERT INTO courses (ccode,  cname, semester, year) VALUES ('204232', 'Tom B. Erichsen', '3', '2433');

-- CREATE TABLE students (
--     username varchar(16) not null,
--     password varchar(100) not null,
--     studentid char(9),
--     fullname varchar(100),
--     primary key (username)
-- );

CREATE TABLE students (
    studentid char(9) not null,
    password varchar(100) not null,
    fullname varchar(70),
    primary key (studentid)
);


-- CREATE TABLE students_in_courses (
--     username varchar(16) not null references students (username),
--     cid integer not null references courses (cid),
--     PRIMARY KEY(username, cid)
-- );

CREATE TABLE students_in_courses (
    studentid varchar(9) not null references students (studentid),
    cid integer not null references courses (cid),
    PRIMARY KEY(studentid, cid)
);

CREATE TABLE assignment_header (
    aid SERIAL not null,
    anumber integer not null,
    aname varchar(100) not null,
    noofquestion integer not null,
    startdate timestamp without time zone,
    duedate timestamp without time zone ,
    dbid integer not null,
    totalscore integer,
    astatus varchar(10) not null,
    cid integer not null,
    primary key (aid),
    foreign key (dbid) references databases (dbid),
    foreign key (cid) references courses (cid)
);

CREATE TABLE question_detail (
    qid SERIAL not null,
    qnumber integer not null,
    aid integer not null,
    qdescription varchar(200),
    score integer not null,
    primary key (qid),
    foreign key (aid) references assignment_header (aid)
);

-- CREATE TABLE student_submit_assignment (
--     submitid SERIAL not null,
--     date timestamp,
--     submittime integer,
--     aid integer not null,
--     submitscore integer not null,
--     detail TEXT [],
--     username varchar(16) not null,
--     primary key (submitid),
--     foreign key (aid) references assignment_header (aid),
--     foreign key (username) references students (username)
-- );

CREATE TABLE student_submit_question (
    submitid SERIAL not null,
    date timestamp,
    submittime integer,
    aid integer not null,
    qnumber integer not null,
    submitscore integer not null,
    studentid varchar(16) not null,
    primary key (submitid),
    foreign key (aid) references assignment_header (aid),
    foreign key (studentid) references students (studentid)
);