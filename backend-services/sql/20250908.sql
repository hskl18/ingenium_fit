alter table t_science
    add comment_num int default 0 null comment 'Number of comments';
alter table t_dynamics_post
    add source_type tinyint default 2 null comment 'Source: 1 = platform created, 2 = user created';

alter table t_leave_word_sub
    add duration varchar(100) default null null comment 'Duration';
