# 奶茶店的Mail图生成器

## 配置需求

目前本软件**仅适配**电脑浏览器并且**不确保支持**触屏控制，推荐使用Chrome或者基于Chromium核心开发的浏览器，但是无法精准地确保其他浏览器能够完全正确地运行；此外，Safari浏览器存在已知的功能缺陷，请尽量避免使用。

## 快速开始

1. 本生成器挂载于Gitee Page，[点此访问](http://yakubo-s-tea-station.gitee.io/mail-generator/)。

2. 

## 工程文件格式定义

工程文件是用于保存当前工作状态的文件，工程文件由三部分组成

### 1. 额外信息
信息头用于存储该工程对应的Mail图的额外信息，额外信息以`%PROJECT_A%`标记作为起始检查点，以json字符串进行存储
#### a. Date
该工程对应的Mail日期，应该以"YYYY-MM-DD"格式存储

### 2. 资源信息
资源信息用于存储模板名、图片等信息，但是不包括Mail图中消息框内的图片。资源信息以`$PROJECT_R%`标记作为起始检查点，以json字符串进行存储
#### a. Format Name
#### b. Format Images
#### c. Avatar Images