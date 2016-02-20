var lastTaskID;

$(document).ready(function() {

    $('body').on('load', getTaskListOnLoad());
    $('#submit_task').on('click', submitTask);
    $('#task-list').on('click', 'button', changeTaskStatus);
    $('#task-list').on('click', 'button', deleteTask);
});

var getTaskListOnLoad = function() {
    $.ajax({
        type: 'GET',
        url: '/get_tasks',
        success: function(data) {
            data.forEach(function(taskInfo, i) {
                appendTaskToDom(taskInfo);
            })
        }
    });
};

var submitTask = function() {
    event.preventDefault();

    var values = {};
    $.each($('#taskCreateForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    values.task_status = false;

    $('#taskCreateForm').find('input[type=text]').val('');

    $.ajax({
        type: 'POST',
        url: '/add_task',
        data: values,
        success: function (data) {
            appendTaskToDom(data.rows[0]);
        }
    });
};

var appendTaskToDom = function (taskInfo) {
    var taskId = taskInfo.task_id;
    var taskName = taskInfo.task_name;
    var taskStatusBool = taskInfo.task_status;
    var taskStatus;

    if (taskStatusBool == false) {
        taskStatus = 'Incomplete';
    } else {
        taskStatus = 'Complete';
    }

    $('#task-list').append('<div id="' + taskId + '" class="task"><ul><li>Task: ' + taskName +
        '</li><li class="task-status">Status: ' + taskStatus + '</li>' +
        '<li><button class="task-complete">Complete Task</button>' +
        '<button class="task-delete">Delete Task</button></li></ul></div>');
}

var changeTaskStatus = function() {
    event.preventDefault();
};

var deleteTask = function() {
    event.preventDefault();
    var delMessage = 'Are you sure you want to delete this task? Press OK to delete.';
    var delConfirm = confirm(delMessage);

    if (delConfirm == true){
        $(this).parent().parent().parent().remove();
        //$.ajax({
        //    type: 'DEL',
        //    url: '/del_task',
        //    success: $(this).parent().parent().parent().remove();
        //})
        }
};