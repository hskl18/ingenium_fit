alter table t_science
    add comment_num int default 0 null comment '评论数量';
alter table t_dynamics_post
    add source_type tinyint default 2 null comment '来源：1-平台创建 2-用户创建';

alter table t_leave_word_sub
    add duration varchar(100) default null null comment '时长';