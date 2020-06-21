# 王文茏｜Part 2｜模块二

## 简答题

### 第一题

大致可分为

0. 初始化

   进行错误检查, 将用户参数, 配置文件, 默认配置等合并, 形成此次编译的配置

1. 准备阶段

   根据配置实例化`compiler`对象, 加载所有插件

2. 编译阶段

   1. 根据配置中的`entry`找到所有入口文件, 每个入口对应一个`chunk`
   2. 从`entry`出发, 对每个被引用的`module`串行调用对应的`loaders`, 进行编译
   3. 对每个`module`, 解析其依赖的modules, 递归地进行编译, 最终得到一棵完整的项目依赖树

3. 生成阶段

   1. 每个entry都会生成一个chunk
   2. 遍历`entry`的依赖树, 将其依赖的模块加入到上一步生成的chunk中
   3. 如果使用了动态导入, 则分割出的每个动态模块都会生成一个对应的chunk
   4. 生成所有chunk后,根据模板生成文件名称
   5. 将每个chunk写入到对应文件中

### 第二题

#### loader

- Loader用于加载资源文件, 是webpack的核心机制
- 类似于一段管道, 需要有输入和输出
- 多个loader可以串联起来共同处理某种文件
- loader的输出可以是任何形式
- 但一个管道的最终输出, 也就是管道的最后一个loader输出, 必须是js代码

##### 开发思路

1. 确定需要处理的文件范围, 以及对应的文件后缀名, 如markdown文件对应`.md`
2. 使用commonjs形式编写并导出一个函数
   1. 该函数接受一个参数, 是匹配到的文件文本内容, 或者上个loader输出的内容
   2. 该函数对文件内容进行编译转换等处理, 最后返回编译后的结果
   3. 如果是最后一个loader, 必须保证返回的是合理的js代码
3. 更新`webpack.config.js`文件使用并测试loader

#### plugin

- plugin用于解决打包过程中的, 除了资源加载外的其他可自动化任务, 如复制, 压缩, 清理等
- 类似于自动脚本, 在webpack编译的各个阶段被触发, 执行自动任务
- 每个plugin独立运作
- plugin不会直接返回输出, 一般通过

##### 开发思路

1. 确定需要完成的自动化任务, 以及需要在webpack打包的[哪个阶段](https://webpack.docschina.org/api/compiler-hooks/#%E9%92%A9%E5%AD%90)执行
2. 编写一个函数或有apply方法的class, 该函数或apply方法
   1. 接收一个`compiler`对象作为参数
   2. 内部可通过调用`compiler.hooks.<someHook>.tap('myPluginName', handler)`, 实现在`<someHook>`阶段执行handler函数, 执行自动化任务
   3. handler函数接受`compilation`参数得到此次打包的上下文
   4. 最终通过更新`compilation.assets`等形式实现对文件的处理
3. 更新`webpack.config.js`文件使用并测试plugin

## 编程题

### 第一题