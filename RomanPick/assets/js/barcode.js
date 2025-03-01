function loadFile(input) {
    var file = input.files[0];   //선택된 파일 가져오기
    var allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    var fileExtension = file.name.split('.').pop().toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
      var formData = new FormData();
      formData.append('imageFile', file);

      // 미리 만들어 놓은 div에 text(파일 이름) 추가
      $('#fileName').text(file.name);
  
      // 새로운 이미지 생성
      var newImage = $('<img>').addClass('img');
  
      // 이미지 source 가져오기
      newImage.attr('src', URL.createObjectURL(file));
  
      newImage.css({
        width: '70%',
        height: '70%',
        objectFit: 'contain',
        visibility: 'hidden' // 초기에는 숨겨진 상태로 설정
      });
  
      // 이미지를 image-show div에 추가
      $('#image-show').empty().append(newImage);
  
      newImage.on('load', function () {
        newImage.css('visibility', 'visible'); // 이미지 로딩 완료 후 보이도록 설정
      });
      
      $.ajax({
        url:"/img_barcode",
        type:"post",
        processData: false,
        contentType: false,
        data:formData,
        beforeSend:function(){
            $('#loading-overlay').css('display', 'flex');
        },
        success:function(result){
            $('#loading-overlay').css('display', 'none');
            if(result.result){
                if(result.book_code == "8"){
                    var qs = $.param(result);
                    window.location.href = "/barcode?"+ qs;
                }else{
                    alert("문학 책만 추천이 가능합니다.");
                    $('#fileName').text("");
                    $('#image-show').children('.img').remove();
                }
            }else{
                alert("바코드를 인식할 수 없습니다.");
                $('#fileName').text("");
                $('#image-show').children('.img').remove();
            }
        },
        error:function(){
            $('#loading-overlay').css('display', 'none');
        }
      })
  }else{
      alert('이미지 파일만 업로드 가능합니다.');
  }
};

$(document).ready(function () {
    var dropArea = $('#barcode');
    var dropEvent = $('.button')
    $('body').on({
        'drop': function(e){
            e.preventDefault();
            dropEvent.removeClass('dragging');
            dropEvent.children('label').text('👉 DROP & CLICK HERE! 👈')
        },
        'dragover':function(e){
            e.preventDefault();
        }
    })
    dropArea.on({
        'dragover': function (e) {
              e.preventDefault();
            dropEvent.children('label').text('👉 DROP & CLICK HERE! 👈')
              dropEvent.addClass('dragging')
        },
        'dragleave': function(e){
            e.preventDefault();
            dropEvent.children('label').text('👉 취소 👈');
            setTimeout(function() {
                dropEvent.removeClass('dragging');
                dropEvent.children('label').text('👉 DROP & CLICK HERE! 👈')
            }, 3000);
            
        },
        'drop': function (e) {
            e.preventDefault();
            dropEvent.removeClass('dragging')
            
            // 이미지 소스를 이용해 바코드 판별
            loadFile(e.originalEvent.dataTransfer)
        }
    });
    dropArea.on();
  });
  
  $(document).on('click', '#image-show', function(){
        $('#fileName').text("");
        $('#image-show').children('.img').remove();
  });
  $(document).on('input','#isbn', function() {
    $(this).val($(this).val().replace(/\D/g, ''));
    
  });

  $(document).on('click', '#btnSubmit', function(e){
    console.log($('#isbn').val())
    var input_text = $('#isbn').val();
    if (input_text == '' || input_text.length != 13){
        e.preventDefault();
        alert('바코드 번호를 입력하세요.');
        return
    }
    $.ajax({
        url:"/input_isbn",
        data : {'isbn' :$('#isbn').val()},
        type:'get',
        success:function(result){
            if(result.result){
                if(result.book_code == "8"){
                    var qs = $.param(result);
                    window.location.href = "/barcode?"+ qs;
                }else{
                    alert("문학 책만 추천이 가능합니다.");
                }
            }else{
                alert("바코드를 인식할 수 없습니다.");
            }
        }
    })
  })

  $(document).on('click', '#drop', function(){
    $.ajax({
        url : "/camera_start",
        type:"get",
        beforeSend:function(){
            $('#loading-overlay').css('display', 'flex');
        },
        success:function(result){
            $('#loading-overlay').css('display', 'none');
            if(result.result){
                if(result.book_code == "8"){
                    var qs = $.param(result);
                    window.location.href = "/barcode?"+ qs;
                }else{
                    alert("문학 책만 추천이 가능합니다.");
                }
            }else{
                alert("바코드를 인식할 수 없습니다.");
            }
        },
        error:function(){
            $('#loading-overlay').css('display', 'none');
        }
    })
})