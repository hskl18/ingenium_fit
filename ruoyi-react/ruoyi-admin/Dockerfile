FROM  openjdk:17
LABEL authors="ycw"

# 挂载目录
#VOLUME /home/app
# 创建目录
RUN mkdir -p /home/app
# 指定路径
WORKDIR /home/app
# 复制jar文件到路径
COPY ./target/ruoyi-admin.jar /home/app/ruoyi-admin.jar
# 启动系统服务
#ENTRYPOINT ["java","-jar","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005","ruoyi-modules-system.jar"]
ENTRYPOINT ["java","-jar","ruoyi-admin.jar"]
