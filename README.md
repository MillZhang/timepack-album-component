# timepack-album

> timepack相簿组件包和工具类

## Build Setup

``` bash
# install dependencies
npm install 'timepack-album' --save
```

## 组件API

### `AlbumGlobal`

> 相簿全局预览组件

#### 使用

```js
import {AlbumGlobal} from 'timepack-album'
```

#### 入参

名称 | 类型 | 含义
---|---|---
product | Object | 产品参数(包含产品类型:相簿/台历)
layout | Array | 容器数据
photoList| Array| 相簿数据

#### 方法


名称 | 参数 | 含义
---|---|---
 change| (photoList,layout)|数据结构变更,反馈变更数据,供父组件处理
 upload| 无 | 触发上传事件

---


### `AlbumGallery`

> 照片库组件,提供图片的修改删除上传和选择操作

#### 使用

```js
import {AlbumGallery} from 'timepack-album'
```

#### 入参

名称 | 类型 | 含义
---|---|---
layout | Array | 容器数据
photoList| Array| 相簿数据
mode | String | 上传模式,有`group`,`single`

#### 方法


名称 | 参数 | 含义
---|---|---
 load| 无|懒加载图片列表的请求
 pageChange| 无 | 懒加载图片列表页数变更
 delete| (ids,groupIndex,imageIndex) | 删除图片 
 upload| 无| 安卓端图片上传
 save|data源图片信息数据| 图片上传保存到服务端
 confirm|data相簿图片信息数据|点击确认按钮,同步图片数据结构
 afterImageLoaded|(page,data)|由父组件触发,图片加载完成后调用
 afterTokenCreated|uptoken|由父组件触发,获取到七牛token后调用
 afterImageDeleted|(groupIndex,imageIndex)|由父组件触发,图片删除后调用
 afterImageSaved|data源图片信息数据|由父组件触发,图片保存完成后调用
 

---

 
## 工具API

### `TimepackQiniu`

#### 使用

```js
import {TimepackQiniu} from 'timepack-album'
```
 
---

### `TimepackUtil`
 
#### 使用

```js
import {TimepackUtil} from 'timepack-album'
```
 
#### 方法
 
method | return | description
---|---|---
getQueryByName(str) | String or Null | get url query-value by query-key
isTelephone(str) |  Boolean | judge string is telephone or not
dateFormat(date,fmt) | String | format date
removeArrayItem(array,index) | String | remove item from an array
browser().isIE()|Boolean| judge current browser is ie or not
browser().isFirefox()|Boolean| judge current browser is firefox or not
browser().isChrome()|Boolean| judge current browser is chrome or not
browser().isAndroid()|Boolean| judge current browser is android or not
browser().isIOS()|Boolean| judge current browser is ios or not
browser().isWeixin()|Boolean| judge current browser is wechat or not
string().trim(str)|String| trim string
string().isEmpty(str)|String| judge the input string is empty
string().isNotEmpty(str)|String| judge the input string is not empty
string().isBlank(str)|String| judge the  input string is blank
string().isNotBlank(str)|String| judge the input string is blank
fileUploader(param,callback)| No Return| upload a file to server through qiniu


#### `fileUploader` method statement

param | default|required
---|---|---
fileType | jpg,png,jpeg |false
buttonId | null | true
uptoken  | null | true
domain   | https://images.cache.timepack.cn/|true
size     | 4mb  |false



callback | description | required
---|--- | ---
added | trigger when files have been added | false
progress | trigger when a file were uploading | false
complete| trigger when a file uploading event completed | false
uploaded| trigger when a file uploading successfully | true
error| trigger when a file uploading event came across an error | false


### `AlbumCanvas`

> 相簿图片自动合成,拖拽,旋转,删除核心模块

#### `render(photo,layout,temp)`

#### `init()`

初始化相簿数据

#### `compatable()`

跨设备分享,数据兼容处理

#### `getter()`

* `template(index)`:模板图片
* `photo(pageIndex,imageIndex)`:
* `radio(index)`:获取容器的长宽比
* `rest()`:获取整页剩余的未填充数量
* `pageRest(index)`:获取指定页数空区域的数量(即未填充的数量)

#### `setter()`

* `editPageStyle(pageIndex,imageIndex,editWidth,editable)`:单页容器模板样式
* `photoStyle(pageIndex,imageIndex)`:单页图片样式
* `groupImage($list)`: 用jquery对象列表批量填充图片
* `listImage(list)`:用图片数据列表填充图片
* `fillImageByPage($list,page)`:根据页数填充图片
* `indexImage($list, page, index)`:单页内根据下标填充图片


#### `operate()`

* `exchange(pageIndex,lastIndex,currentIndex)`:更换图片间顺序
* `rotate(pageIndex,imageIndex)`:顺时针旋转图片90度
* `zoomImage(pageIndex,index,type)`:放大或缩小图片,type-1放大,type-2缩小
* `convert($list)`:图片jquery对象转换为可用的数据结构
* `changeLayout(index)`:修改容器模板

#### `delete()`

* `deleteImageByIndex(pageIndex,imageIndex)`:删除指定页内指定图片


#### `event`

* `touchstart(e,target)`:
* `touchmove(e, startPosition, position, target)`:
* `touchend(e, page, index, position, target)`: