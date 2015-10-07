/**
 * ajax.js v1.1.0 
 * https://github.com/striverx/ajax
 * 参考 jQuery 1.11-stable <https://github.com/jquery/jquery/tree/1.11-stable>
 * Date: 2015/10/06
 */

;(function(window) {

    'use strict';
    
    var _options = {
            // 请求地址
            url: '',
            // 请求方法
            method: 'GET',
            // 请求参数
            data: null,
            // 是否异步
            async: true,
            // 请求头
            headers: null,
            // 内容类型，告诉XHR使用哪种数据类型解析返回结果
            mimeType: '',
            // 内容类型，告诉服务器该请求接受哪种类型的返回结果
            accepts: {
                '*': '*/' + '*',
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript',
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            // 使用什么数据类型发送数据到服务器
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // 是否需要处理data参数
            processData: true,
            // 超时时间(毫秒)
            timeout: 0,
            // 是否允许浏览器缓存
            cache: true,
            // 以哪种数据类型解析返回结果
            dataType: null,
            // 回调执行上下文
            context: null,
            // 请求发送前调用此函数，函数返回false将取消发送这个请求
            beforeSend: null,
            // 过滤请求结果
            dataFilter: null,
            // 请求成功后调用此函数
            success: null,
            // 请求失败后调用此函数
            error: null,
            // 请求完成后，无论成功还是失败，都将调用此函数
            complete: null,
            // 指定jsonp的回调函数名称
            jsonp: 'jsonp',
            jsonpCallback: function() {},
            // 响应HTTP访问认证请求的用户名
            username: null,
            // 响应HTTP访问认证请求的密码
            password: null,
            // 创建XMLHttpRequest对象方法
            createXHR: window.ActiveXObject ? function() {
                return createStandardXHR() || createActiveXHR();
            } : createStandardXHR
        };

    // 检测属性是否属于自己
    var hasOwnProp = Object.prototype.hasOwnProperty;

    /**
     * [ajax description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function ajax(opt) {

        var // 合并选项
            options = mergeOptions(mergeOptions({}, _options), opt),
            // 请求是否需要提交数据
            needSendData,
            // request headers
            reqHeaders = {},
            // 超时定时器
            timeoutTimer;

        // 纠正 method
        options.method = ((options.method || 'GET') + '').toUpperCase();

        // jQuery 与 Zepto 在这点的处理上有区别，暂且使用jQuery的
        needSendData = !/^(?:GET|HEAD)/.test(options.method);

        // 纠正 dataType
        var dataType = (options.dataType + '').toLowerCase();
        options.dataType = options.accepts[dataType] ? dataType : '*';

        // 加工 data 为 string
        var reqData = options.data;
        if (options.processData && reqData && typeof reqData !== 'string') {
            options.data = serializeData(options.data);
        }

        // GET/HEAD请求需要把data处理成query
        if (!needSendData) {
            
            
            // 非GET/HEAD请求浏览器是不会缓存的
            if (options.cache === false) {
                
            }
        }

        // 创建XMLHttpRequest对象
        var xhr = options.createXHR();

        // 初始化请求
        xhr.open(options.method, options.url, options.async, options.username, options.password);

        // 设置 Accept
        var accept = options.accepts[options.dataType];
        reqHeaders.Accept = accept.indexOf('*/*') === -1 ? accept + ', */*; q=0.01' : accept;

        // 设置 Content-Type
        if (needSendData && options.data && options.contentType) {
            reqHeaders['Content-Type'] = options.contentType;
        }

        // 设置 Request Headers
        mergeOptions(reqHeaders, options.headers);
        for (var hName in reqHeaders) {
            if (reqHeaders[hName] !== undefined) {
                xhr.setRequestHeader(hName, reqHeaders[hName] + '');
            }
        }

        // 覆盖 mimeType


        // 请求超时后取消请求
        if (options.timeout > 0) {
            timeoutTimer = setTimeout(function() {
                xhr.abort();
            }, options.timeout);
        }

        // 监听请求状态
        xhr.onreadystatechange = function() {
            // alert(xhr.readyState + '--' + xhr.status);
        };

        // 发送请求
        xhr.send((needSendData && options.data) || null);

        console.log(options);
    }

        /**
     * [setOptions description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    ajax.setOptions = function(opt) {
        return mergeOptions(_options, opt);
    };

    /**
     * [param 参考jQuery，没有什么标准]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function serializeData(obj) {
        var s = [];
        
        if (isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                add(obj[i].name, obj[i].value);
            }

        } else if (isPlainObject(obj)) {
            for (var name in obj) {
                serialize(name, obj[name]);
            }

        } else {
            // 
        }

        function serialize(prefix, obj) {
            if (isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    serialize(prefix + '[' + (typeof obj[i] === 'object' ? i : '') +']', obj[i]);
                }
            } else if (isPlainObject(obj)) {
                for (var name in obj) {
                    serialize(prefix + '['+ name +']', obj[name]);
                }
            } else {
                add(prefix, obj);
            }
        }

        function add(name, value) {
            value = isFunction(value) ? value() : (value == null ? '' : value) ;
            s.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));   
        }

        return s.join('&').replace(/%20/g, '+');
    }

    /**
     * [createStandardXHR 创建标准的XMLHttpRequest对象]
     * @return {[type]} [description]
     */
    function createStandardXHR() {
        try {
            return new XMLHttpRequest();
        } catch(e) {}
    }

    /**
     * [createActiveXHR 创建非标准的XMLHttpRequest对象]
     * @return {[type]} [description]
     */
    function createActiveXObjectXHR() {
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch(e) {}
    }

    /**
     * [mergeOptions 合并选项]
     * 这里使用了 for in 来遍历数组，有问题吗？
     * 注意这里除了函数复制的依然是引用，其他都是深copy
     * @param  {[type]} target [description]
     * @param  {[type]} source [description]
     * @return {[type]}        [description]
     */
    function mergeOptions(target, source) {
        var key, val, tVal, isArr = isArray(target);

        for (key in source) {
            if (hasOwnProp.call(source, key)) {
                val = source[key];
                tVal = target[key];

                // val是对象
                if (isPlainObject(val)) {
                    target[key] = mergeOptions(tVal || {}, val);

                // val是数组
                } else if (isArray(val)) {
                    target[key] = mergeOptions(tVal || [], val);

                // otherwise
                } else if (val !== undefined) {
                    // 是数组时不要覆盖有值的索引
                    key = isArr ? target.length : key;
                    target[key] = val;
                }
            }
        }

        return target;
    }

    /**
     * [isPlainObject 还需要优化]
     * null 在IE8/7下使用 toString 会返回 [object Object]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isPlainObject(obj) {
        return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
    }

    /**
     * [isArray 还需要优化]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * [isFunction 检测是否是函数]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isFunction(obj) {
        return typeof obj === 'function';
    }

    window.ajax = ajax;

})(this);





























