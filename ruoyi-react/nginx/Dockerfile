# 基础镜像
FROM nginx:1.26.2
# author
LABEL authors="Administrator"

# 挂载目录
#VOLUME /home/ziyuan/ruoyi-ui
# 创建目录
RUN mkdir -p /home/xgwy/ruoyi-ui
# 指定路径
WORKDIR /home/xgwy/ruoyi-ui
# 复制conf文件到路径
COPY conf/nginx.conf /etc/nginx/nginx.conf
# 复制html文件到路径
COPY ./html /home/xgwy/ruoyi-ui
