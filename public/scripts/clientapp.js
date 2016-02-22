var lastTaskID;

$(document).ready(function() {

    $('body').on('load', getTaskListOnLoad());
    $('#submit_task').on('click', submitTask);
    $('#task-list').on('click', '.task-complete', changeTaskStatusOnClick);
    $('#task-list').on('click', '.task-delete', deleteTask);
});

var getTaskListOnLoad = function() {
    $.ajax({
        type: 'GET',
        url: '/get_tasks',
        success: function(data) {
            data.forEach(function(taskInfo, i) {
                appendTaskToDom(taskInfo);
                getTaskStatusOnLoad(taskInfo);
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
        success: function(data) {
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

    $('#task-list').append('<div id="' + taskId + '" class="task"><p>Task: ' + taskName +
        '</p><p class="task-status' + taskId + '">Status: ' + taskStatus + '</p>' +
        '<p><button class="task-complete">Complete Task</button>' +
        '<button class="task-delete">Delete Task</button></p></ul></div>');
};

var changeTaskStatusOnClick = function() {
    event.preventDefault();
    var taskIdString = $(this).parent().parent().attr('id');
    var taskIdObj = {task_id: taskIdString};
    $.ajax({
        type: 'POST',
        url: '/get_this_task',
        data: taskIdObj,
        success: function(data){
            var taskStatus = data[0].task_status;
            if (taskStatus == false) {
                $.ajax({
                    type: 'POST',
                    url: '/complete_task',
                    data: taskIdObj,
                    success: function() {
                        $('#' + taskIdObj.task_id).addClass('completed-task');
                        $('.task-status' + taskIdObj.task_id).text('Status: Complete');
                        $('#' + taskIdObj.task_id).find('.task-complete').text('Redo Task');
                    }
                });

            } else {
                $.ajax({
                    type: 'POST',
                    url: '/redo_task',
                    data: taskIdObj,
                    success: function() {
                        $('#' + taskIdObj.task_id).removeClass('completed-task');
                        $('.task-status' + taskIdObj.task_id).text('Status: Incomplete');
                        $('#' + taskIdObj.task_id).find('.task-complete').text('Complete Task');
                    }
                });
            }

        }
    });
};

var deleteTask = function() {
    event.preventDefault();
    var delMessage = 'Are you sure you want to delete this task? Press OK to delete.';
    var delConfirm = confirm(delMessage);
    var taskIdString = $(this).parent().parent().attr('id');
    var taskIdObj = {task_id: taskIdString};

    if (delConfirm == true){
        $(this).parent().parent().remove();
        $.ajax({
            type: 'DELETE',
            url: '/del_task',
            data: taskIdObj,
            success: $(this).parent().parent().remove()
        });
        }


};

var getTaskStatusOnLoad = function(data) {
    var taskStatus = data.task_status;
    if (taskStatus == true) {
        $('#' + data.task_id).addClass('completed-task');
        $('#' + data.task_id).find('.task-complete').text('Redo Task');

    } else {
        $('#' + data.task_id).removeClass('completed-task')
        $('#' + data.task_id).find('.task-complete').text('Complete Task');
    }
};