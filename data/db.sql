--1--
insert into teacher(teacher_name,passwrd) value(?,?)
--2--
SELECT user_name,passwrd from teacher
--3--
SELECT course_id, teacher_name from teacher
--4--
insert into course(course_id,teacher_name) value(?,?)
--5--
SELECT studentID from course 
SELECT studentID, points from scorelist 
SELECT studentID, attendencestatus from attendence
--6--
insert into course(course_id,studentID) value(?,?)
--7--
DELETE course(studentID) 
--8
SELECT attendencestatus from attendence 
--9
insert into attendence(studentID,attendencestatus,course_id) value(?,?,?)
--10
SELECT studentID, points, course_id from scorelist
--11
insert into scorelist(studentID,points,course_id)