USE `grader`;

CREATE TABLE course (
    cid char(6) not null,
    cname varchar(50) not null,
    term integer,
    year char(4)
    primary key (cid)
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
    primary key (anumber),
    foreign key (dbid) references databases (dbid)
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

