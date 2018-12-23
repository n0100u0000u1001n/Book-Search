//向solr发送请求的url
// var url = '';
//计数器
var counter = 0;

var coreType = '';

var key_word = '';

$(document).ready(function () {
    // 页面刚开始隐藏搜索结果的部分
    $("#resultSection").hide();

    // id为searchPaper的按钮按下触发searchPaper()方法
    $("#searchBook").click(function () {
        keyword = $("#keyword").val();
        search('title', keyword);
    });

    // id为keyword的输入框内容改变触发getSuggest()方法
    $("#keyword").on("input propertychange", function () {
        getSuggest();
    });

    //获取分类点击事件
    $(".nav-link").click(function () {
        key = $(this).text();
        if (key == '全部') {
            key = '*';
            search('title', key);
        }else{
            search('category', key);
        }
    });

    // 加载更多
    $("#more").click(function () {
        if ($(this).text() == '加载更多') {
            getMore();
        }
    });

});

// 按下联想的词就直接搜索
$(document).on("click", ".list-group-item-action", function () {
    search('search', $(this).text());
    $("#keyword").val($(this).text());

});

// 检测按键
$(document).keyup(function (event) {
    if (event.keyCode == 13) { //enter
        search('title', $("#keyword").val());
    }
});

//加载更多函数
function getMore() {
    url = "http://39.108.0.16/solr/" + coreType + "/select?q=" + key_word + "&rows=10&start=" + counter + "&json.wrf=?";
    $(".js-load-more").hide();
    $.getJSON({
        url,
        success: function (result) {
            // 获取返回的数据中我们需要的部分
            res = result.response.docs;
            // 利用for插入每一个结果
            if (res.length) {
                for (i = 0; i < res.length; i++) {

                    // 将返回的结果包装成HTML
                    resultItem = `
                    <div class="media1 inputpaper">
                    <div class="input_img"><img class="inputimg" src="` + res[i].img_url + `" width="115px" height="172px" alt="Generic placeholder image"></div>
                    <div><p>&emsp;&nbsp;&nbsp;</p></div>
                    <div class="media-body">
                    <h5 class="mt-0"><b>书名：` + res[i].title + `</b></h5>
                    <h6 class="mt-0">类别：` + res[i].category + `</h6>
                    <h6 class="mt-0">作者：` + res[i].author + `</h6>
                    <p>简介：` + res[i].abstract + `</p>
                    </div>
                    </div>`;
                    // 插入HTML到result中
                    $("#result").append(resultItem);
                    counter++;
                }
                // 显示搜索结果的部分
                $("#resultSection").show();
                if (res.length < 10) {
                    $(".js-load-more").text('没有更多了');
                } else {
                    $(".js-load-more").text('加载更多');
                }
                $(".js-load-more").show();
            }
        }
    });
}
//搜索初始输出
function search(core, key) {
    coreType = core;
    key_word = key;
    counter = 0;
    url = "http://39.108.0.16/solr/" + coreType + "/select?q=" + key_word + "&rows=10&start=" + counter + "&json.wrf=?";
    // 首先清空result中的内容以便内容填入
    $("#result").empty();
    $(".js-load-more").hide();
    $.getJSON({
        url,
        success: function (result) {
            // 获取返回的数据中我们需要的部分
            res = result.response.docs;
            // 利用for插入每一个结果
            if (res.length) {
                for (i = 0; i < res.length; i++) {
                    // 将返回的结果包装成HTML
                    resultItem =
                        `
                    <div class="media1 inputpaper">
                    <div class="input_img"><img class="inputimg" src="` + res[i].img_url + `" width="115px" height="172px" alt="Generic placeholder image"></div>
                    <div><p>&emsp;&nbsp;&nbsp;</p></div>
                    <div class="media-body">
                    <h5 class="mt-0"><b>书名：` + res[i].title + `</b></h5>
                    <h6 class="mt-0">类别：` + res[i].category + `</h6>
                    <h6 class="mt-0">作者：` + res[i].author + `</h6>
                    <h6 class="mt-0">简介：` + res[i].abstract + `</h6>
                    </div>
                    </div>`;
                    // 插入HTML到result中
                    $("#result").append(resultItem);
                    counter++;
                }
                // 显示搜索结果的部分
                $("#resultSection").show();
                // 清空输入联想
                $("#suggestList").empty();
                $("html,body").animate({
                    scrollTop: 670
                }, 400);
                if (res.length < 10) {
                    $(".js-load-more").text('没有更多了');
                } else {
                    $(".js-load-more").text('加载更多');
                }
                $(".js-load-more").show();
            } else {
                nothing = `<div class="container text-center" style="font-size:20px">没有相关内容</div>`
                $("html,body").animate({
                    scrollTop: 670
                }, 400);
                $("#result").append(nothing);
                $("#resultSection").show();
            }
        }
    });
}
//搜索建议
function getSuggest() {
    // 首先清空suggestList中原来的内容以便内容填入
    $("#suggestList").empty();
    // 向服务器请求联想词
    $.getJSON({
        url: "http://39.108.0.16/solr/suggest/suggest?q=" + $("#keyword").val() + "&json.wrf=?",
        success: function (result) {
            // 获取返回的数据中我们需要的部分
            res = result.suggest.mySuggester[$("#keyword").val()];
            if (res.suggestions.length) {
                // 利用for插入每一个结果
                for (i = 0; i < 4; i++) {
                    // 将返回的结果包装成HTML
                    suggestItem =
                        "<a class='list-group-item list-group-item-action'>" + res.suggestions[i].term + "</a>";
                    // 插入HTML到suggestList中
                    $("#suggestList").append(suggestItem);
                }
            }
        }
    });
}
//检测页面滚动输出小火箭
window.onscroll = function () {
    scrollFunction()
};
//小火箭
function scrollFunction() {
    console.log(121);
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// 点击按钮，返回顶部
function topFunction() {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
}
