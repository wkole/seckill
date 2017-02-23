//存放主要交互逻辑js代码
var seckill = {
    //封装秒杀相关ajax的url
    URL: {
        now: function () {
            return '/seckill/time/now';
        },
        exposer: function (seckillId) {
            return '/seckill/' + seckillId + '/exposer';
        },
        execution: function (seckillId, md5) {
            return '/seckill/' + seckillId + '/' + md5 + '/execution';
        }
    },
    //验证手机号
    validatePhone: function (phone) {
        if (phone && phone.length == 11 && !isNaN(phone)) {
            return true;
        } else {
            return false;
        }
    },
    handleSeckillkill: function (seckillId, node) {
        //获取秒杀地址，控制显示逻辑，执行秒杀
        node.hide()
            .html('<button class="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
        $.post(seckill.URL.exposer(seckillId), {}, function (result) {
            //在回调函数中，执行交互流程
            if (result && result['success']) {
                var exposer = result['data'];
                if (exposer['exposed']) {
                    //开启秒杀
                    //获取秒杀地址
                    var md5 = exposer['md5'];
                    var killUrl = seckill.URL.execution(seckillId,md5);
                    console.log("killUrl:"+killUrl);
                    //绑定一次点击事件
                    $('#killBtn').one("click",function () {
                       //执行秒杀请求
                        //1；先禁用按钮
                        $(this).addClass('disabled');
                        //2发送秒杀请求
                        $.post(killUrl,{},function (result) {
                            var killResult = result['data'];
                            var state = killResult['state'];
                            var stateInfo = killResult['stateInfo'];
                            if(result && result['success']){
                                //3显示秒杀结果
                                node.html('<span class="label label-success">'+ stateInfo+'</span>');
                            }else{
                                node.html('<span class="label label-danger">'+ stateInfo+'</span>');
                            }
                        });
                    });
                    node.show();
                } else {
                    //未开启秒杀
                    var now = exposer['now'];
                    var start = exposer['start'];
                    var end = exposer['end'];
                    seckill.countdownTime(seckillId, now, start, end);
                }
            } else {
                console.log('result' + result);
            }
        });
    },
    countdownTime: function (seckillId, nowTime, startTime, endTime) {
        var seckillBox = $('#seckill-box');
        //时间的判断
        if (nowTime > endTime) {
            //秒杀结束
            seckillBox.html('秒杀结束!');
        } else if (nowTime < startTime) {
            //秒杀未开始，计时
            var killTime = new Date(startTime + 1000);
            seckillBox.countdown({
                startTimestamp: startTime,
                nowTimestamp: nowTime,
                callback: function (days, hours, minutes, seconds) {
                    if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
                        seckill.handleSeckillkill(seckillId, seckillBox);
                    }
                }
            });

        } else {
            //秒杀开始
            seckill.handleSeckillkill(seckillId, seckillBox);
        }
    },
    //详情页秒杀逻辑
    detail: {
        //详情页初始化
        init: function (params) {
            //手机验证和登录,计时交互
            //规划交互流程
            //从cookie 中拿取手机号
            var killPhone = $.cookie('killPhone');
            //验证手机号
            if (!seckill.validatePhone(killPhone)) {
                //绑定手机号
                //控制输出
                var killPhoneModal = $("#killPhoneModal");
                killPhoneModal.modal({
                    show: true,//显示弹出层
                    backdrop: 'static',//禁止位置关闭
                    keyboard: false//关闭键盘事件
                });
                $('#killPhoneBtn').click(function () {
                    var inputPhone = $('#killPhoneKey').val();
                    if (seckill.validatePhone(inputPhone)) {
                        //手机写入cookie
                        $.cookie('killPhone', inputPhone, {expires: 7, path: '/seckill'});
                        //刷新页面
                        window.location.reload();
                    } else {
                        $('#killPhoneMessage').hide().html('<label class="label label-danger">手机号错误!</label>').show(300);
                    }
                });
            }
            //验证通过
            //计时交互
            var startTime = params['startTime'];
            var endTime = params['endTime'];
            var seckillId = params['seckillId'];
            $.get(seckill.URL.now(), {}, function (result) {
                if (result && result.success) {
                    var nowTime = result['data'];
                    //时间判断
                    seckill.countdownTime(seckillId, nowTime, startTime, endTime);
                } else {
                    console.log('result:' + result);
                }
            });
        }
    }

}