(function(){
  $(function(){
    var form;
    window.detailSpec = detailSpecGenerator.generate(widgetSpec);
    console.log(detailSpec);
    form = $('form#assignment').append(fieldsetMaker.make(detailSpec));
    return window.assignmentForm = formManager.create(form);
  });
}).call(this);
