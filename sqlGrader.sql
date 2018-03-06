USE `grader`;
CREATE TABLE assignment_header (
    anumber integer not null,
    aname varchar(100) not null,
    noofquestion integer not null,
    startdate date,
    duedate date,
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