
# Introduction介绍:<h3>

    It's a GJK based 2D collision test tutorial demo.
    Including common collision test and CCD(continuous collision detection).
    
    这是一个基于GJK的2D碰撞演示demo。
    包含了普通的碰撞检测和CCD（连续碰撞检测）。

# Prerequisite准备:<h4>

  1. Install the latest stable version of Node.js.
  2. Execute "npm install -g typescript" to install typescript compiler on your computer.
  
  1. 安装最新版本的Node.js。
  2. 执行 "npm install -g typescript" 来安装typescript的支持。

# Build编译:<h4>
    All the source code is located in "TsSource" folder. 
    Please execute "tsc" command in the "TsSource" folder to compile source files after you've modified it.
    
    所有的typescript源代码都放在"TsSource"目录下。 
    当您修改了源代码之后，需要在命令行下进入"TsSource"目录，并且执行"tsc"指令来编译源代码。

# Run运行:<h4>
    Open "index.html" by web browser to see the effect. Chrome is the suggested web browser to open it.
    
    打开"index.html"即可运行Demo。推荐使用Chrome浏览器。



# How to use demo 怎样使用demo:<h4>
    This Demo need 2 convex objects to do the collision detect. There are already 2 triangles when you open this demo. If you want to modify it， you can clear all the convex objects by clicking the "Clear All Convex Objects" button. 
    And then, you can choose the type of convex object in the drop down selector. 
    Currently, this demo support 3 types of convex, Polygon, Circle and Capsule. you can begin to add it by clicking the "Begin Add Convex" button, and click the "Cancel Add Convex" button to cancel adding new convex object. Finaly, when you click the "Finish Add Convex" Button, the new convex will be added.(This button is needed only for Polygon, when Circle and Capsule can be added automatically)
    You can drag the convex Object by Middle Mouse Button, and scale the coordinate by Mouse Wheel.
    1. When the convex type is Polygon, every time when you clicking the Left Mouse Button, a new Vertex will be added, and you can delete the last one by clicking Right Mouse Button. After all the vertices are added, you can click the "Finish Add Convex" button to complete this action.
    2. When the convex type is Circle, the first time you clicking the Left Mouse Button is to configure the center of the circle, and you can move your cursor to adjust the radius. Finally, click Left Mouse Button again to finish your action.
    3. When the convex type is Capsule, the first and second times you cliking the Left Mouse Button is to configure the P0 and P1 points of the Capsule, and you can move your cursor to adjust the radius. Finally, click Left Mouse Button again to finish your action.

    Demo需要两个凸多边形来进行碰撞检测。 默认有两个三角形。 如果要修改的话，您可以点击"Clear All Convex Objects"按钮来清空当前的多边形。 然后在下拉菜单里选择您要添加的多边形类型。
    目前支持多边形和圆形、胶囊体。添加方式是点击"Begin Add Convex"按钮来增加关键点， 点击"Cancel Add Convex"来退出添加多边形的操作，点击"Finish Add Convex"完成当前增加多边形的操作。
    对着凸多边形按下鼠标中键可以拖动凸多边形的位置。鼠标滚轮可以调整坐标系的大小。

    1. 当添加模式为Polygon多边形的时候，每次在坐标图上点击鼠标左键就可以增加一个顶点，点击鼠标右键可以撤销最近添加的一个顶点。当顶点足够之后，就可以点击"Finish Add Convex"来完成当前操作了。 
    2. 当添加模式为Circle圆形的时候，第一次点击鼠标左键是确定中心点位置，然后移动鼠标可以调整半径，当决定了之后再点击一次鼠标左键就可以完成添加。 
    3. 当添加模式为Capsule胶囊体的时候，第一次和第二次鼠标左键点击是确定高度的两个端点的位置，然后移动鼠标可以调整半径，当决定了之后再点击一次鼠标左键就可以完成添加。 
