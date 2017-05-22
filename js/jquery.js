var page_num = 1,
    database = databases,
    limited;

function initPageNumbers(limit) {
    var current_link = 0,
        paginate_html = "<li class='paginate_button previous' id='boxTable_previous'><a><</a></li>",
        number_of_pages = Math.ceil(database.length / limit);

    while (current_link < number_of_pages) {
        var y = (current_link == 0) ? "active" : "";
        paginate_html += "<li class='paginate_button page " + y + "'><a data-id='" + (current_link + 1) + "' data-index='" + current_link + "'>" + (current_link + 1) + "</a></li>";
        current_link++;
    }
    paginate_html += "<li class='paginate_button next' id='boxTable_next'><a>></a></li>";

    $(".pagination").html(paginate_html);
    if ($("li.paginate_button.active").index() == 1) {
        $("li.paginate_button.previous").addClass("disabled");
    }

};
function getPage(page_num, limit) {
    if (database.length > 0) {
        var data = "",
            data_start = $('.paginate_button.active a').data().index * limit,
            data_end = ($('.paginate_button.active a').data().id * limit) > database.length ? database.length : ($('.paginate_button.active a').data().id * limit);

        $(".dataTables_info").text("Showing " + (data_start + 1) + " to " + data_end + " of " + database.length + " entries");
        for (data_start; data_start < data_end; data_start++) {
            var x = (data_start % 2 == 0) ? "odd" : "even";
            data += "<tr class=" + x + "><td>" + database[data_start].rendering + "</td>"
                + "<td>" + database[data_start].browser + "</td>"
                + "<td>" + database[data_start].platform + "</td>"
                + "<td>" + database[data_start].version + "</td>"
                + "<td>" + database[data_start].grade + "</td></tr>";
        }
        $("tbody").html(data);
    } else {
        $(".dataTables_info").text("Showing 0 to 0 of 0 entries");
        $("tbody").html("<tr><td colspan='5' class='dataTables_empty'>No matching records found</td></tr>");
    }
};

function changepage(id, variable) {
    page_num = id;

    variable.addClass("active").siblings().removeClass("active disabled");

    if ($("li.paginate_button.active").index() == Math.ceil(database.length / limited)) {
        $("li.paginate_button.next").addClass("disabled");
    }
    if ($("li.paginate_button.active").index() == 1) {
        $("li.paginate_button.previous").addClass("disabled");
    }
    getPage(page_num, limited);
};

function sortResults(prop, asc) {
    database = database.sort(function (a, b) {
        if (asc) return a[prop] == b[prop] ? 0 : (a[prop] < b[prop] ? -1 : 1);
        else return a[prop] == b[prop] ? 0 : (a[prop] > b[prop] ? -1 : 1);
    });
};

function searchData(text) {
    var arraySearch = [];
    if (text.length > 0) {

        $.map(databases, function (val, i) {
            if ((val.rendering).toLowerCase().includes(text.toLowerCase().toString()) ||
                (val.browser).toLowerCase().includes(text.toLowerCase().toString()) ||
                (val.platform).toLowerCase().includes(text.toLowerCase().toString()) ||
                (val.version).toLowerCase().includes(text.toLowerCase().toString()) ||
                (val.grade).toLowerCase().includes(text.toLowerCase().toString())
            ) {
                arraySearch.push(val)
            }

        });
        database = arraySearch;
    } else {
        database = databases;
    }
}

$(document).ready(function () {
    searchData("");

    $('select[name="boxTable_length"]').on("change", function () {
        sortResults($(".table-head th.asc").attr('id'), true);
        initPageNumbers($(this).val());
        getPage(page_num, $(this).val());
        limited = $(this).val();
    }).change();

    $('ul.pagination').on("click", 'li.paginate_button.page', function () {
        changepage($('.paginate_button.active a').data().id, $(this))
    });

    $('ul.pagination').on("click", 'li.paginate_button.previous', function () {
        if ($('.paginate_button.active').index() == '1') return;
        changepage(($('.paginate_button.active').index() - 1), $('.paginate_button.active').prev());
    });

    $('ul.pagination').on("click", 'li.paginate_button.next', function () {
        if ($('.paginate_button.active').index() == Math.ceil(database.length / limited)) return;
        changepage(($('.paginate_button.active').index() + 1), $('.paginate_button.active').next());
    });

    $(".table-head th").on("click", function () {
        var id = $(this).attr('id'),
            asc = (!$(this).attr('asc'));
        if (asc) $(this).addClass("asc").attr('asc', 'asc').removeAttr('desc').removeClass("desc").siblings().removeAttr('asc desc').removeClass("asc desc");
        if (!asc) $(this).addClass("desc").attr('desc', 'desc').removeAttr('asc').removeClass("asc").siblings().removeAttr('asc desc').removeClass("asc desc");

        sortResults(id, asc);
        initPageNumbers(limited);
        getPage("1", limited);
    });

    $("#boxTable_filter").on("keyup", ".input-right", function () {
        searchData($(this).val());
        initPageNumbers(limited);
        getPage("1", limited);
    });

});
