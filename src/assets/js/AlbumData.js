/**
 * === Javascript Module ======================
 * Copyright (c) 2016 Mill, All rights reserved.
 *
 * @version 1.0
 * @author Mill
 * @description 相簿整体数据结构定义
 * ---2017/2/27----------------------------------
 */

/**
 * 整改相簿对象
 *
 * @class      Album (name)
 */
let Album = function () {
  this.albumName = null;
  this.albumPageinfo = [];
  this.backCoverInfo = null;
  this.coverInfo = null;
  this.id = null;
  this.userid = null;
  this.productid = null;
  this.localaid = null;
  this.isdeleted = false;
  this.price = 0;
  this.iscompeleted = true;
  this.totalPages = 0
  this.isauto = false;
  this.albumJson = '';
}

/**
 * 页对象 详情
 *
 * @class      AlbumPageinfoItem (name)
 */
let AlbumPageinfoItem = function () {
  this.albumPageDetailslist = [];
  this.ext1 = null;
  this.ext2 = null;
  this.id = null;
  this.layoutStyle = {
    main: 0,
    sub: 0
  };
  this.text = null;
  this.snapshot = null;
  this.photoCount = null;
  this.pageindex = null; //页数
}

/**
 * 页内图片详情
 *
 * @class      AlbumPageDetailsItem (name)
 */
let AlbumPageDetailsItem = function () {
  this.platforminfo = "H5";
  this.imageid = null;
  this.id = null;
  this.degree = 0;
  this.scale = 0;
  this.cliph = 0;
  this.layoutIndex = 1;
  this.offsetx = 0;
  this.offsety = 0;
  this.border = 0;
  this.clipw = 0;
  this.srch = 0;
  this.srcw = 0;
}
module.exports = {Album,AlbumPageinfoItem,AlbumPageDetailsItem};
