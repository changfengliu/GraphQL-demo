window.onload = function () {
  // 点击graphQL一次获取所有数据，问你怕不怕？
  $('#btn3').click(loadAll)
  // gql添加课程
  $('#qal_add_class').click(() => {
    const title = $('#c_title').val()
    const desc = $('#c_desc').val()
    const page = Number($('#c_page').val())
    const author = $('#c_author').val()
    $.ajax({
      url: '/graphql',
      contentType: "application/json",
      type: 'POST',
      data: JSON.stringify({
        query: `
          mutation {
            addCourse (post: {
              title: "${title}"
              desc: "${desc}"
              page: ${page}
              author: "${author}"
            }) {
              title
              desc
              page
              author
            }
          }
        `
      }),
      success: loadAll
    })
  })
  // 点击添学生程数据
  $('#btn5').click(() => {
    $('#s_name').val('')
    $('#s_sex').val('')
    $('#s_age').val('')
    $('#side2').css({
      transform: 'translateX(0px)'
    })
  })
  // gql添加学生
  $('#qal_add_student').click(() => {
    const name = $('#s_name').val()
    const sex = $('#s_sex').val()
    const age = Number($('#s_age').val())
    $.ajax({
      url: '/graphql',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({
        query: `
          mutation {
            addStudent (post: {
              name: "${name}"
              sex: "${sex}"
              age: ${age}
            }) {
              name
              sex
              age
            }
          }
        `
      }),
      success: loadAll
    })
  })

  let isAddInfo = false
  let infoId = null
  // 打开学生info
  $('#studentList').click(e => {
    if (e.target.nodeName === 'A') {
      $('#side3').css({
        transform: 'translateX(0px)'
      })
      getStudentInfo(e.target.dataset.id).then(res => {
        infoId = e.target.dataset.id
        if (res) {
          isAddInfo = false
          $('#i_height').val(res.height)
          $('#i_weight').val(res.weight)
          let checkboxs = $('#side3 input[name="hobby"]')
          res.hobby.forEach(item => {
            for (let i = 0; i < 4; i++) {
              if (checkboxs[i].value === item) {
                checkboxs[i].checked = true
              }
            }
          })
        } else {
          $('#i_height').val('')
          $('#i_weight').val('')
          let checkboxs = $('#side3 input[name="hobby"]')
          for (let i = 0; i < 4; i++) {
            checkboxs[i].checked = false
          }
          isAddInfo = true
        }
      })
    }
  })

  // 新增学生信息
  $('#qal_add_student_info').click(() => {
    const height = $('#i_height').val()
    const weight = $('#i_weight').val()
    let hobby = []
    let checkboxs = $('#side3 input[name="hobby"]')
    for (let i = 0; i < 4; i++) {
      if (checkboxs[i].checked === true) {
        hobby.push(checkboxs[i].value)
      }
    }
    hobby = JSON.stringify(hobby)
    // 新增
    if (isAddInfo) {
      $.ajax({
        url: '/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
          query: `
            mutation {
              addStudentInfo(
                id: "${infoId}", 
                height: "${height}", 
                weight: "${weight}",
                hobby: ${hobby}
              ) {
                height
                weight
                hobby
              }
            }
          `
        }),
        success: loadAll
      })
    } else { // 修改
      $.ajax({
        url: '/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
          query: `
            mutation {
              changeStudentInfo(
                id: "${infoId}", 
                height: "${height}", 
                weight: "${weight}",
                hobby: ${hobby}
              ) {
                height
                weight
                hobby
              }
            }
          `
        }),
        success: loadAll
      })
    }
  })

  function loadAll() {
    $.ajax({
      url: '/graphql',
      data: {
        query: `query {
          getCourse{
            title
            page
            author
            desc
          }
          getStudent{
            name
            sex
            age
            _id
          }
        }`
      },
      success: function (res) {
        renderStudent(res.data.getStudent)
        renderCourse(res.data.getCourse)
      }
    })
  }

  function getStudentInfo(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/studentInfo',
        data: { id: id },
        success: function (res) {
          if (res.success) {
            resolve(res.data)
          } else {
            resolve(false)
          }
        }
      })
    })
  }

  function renderStudent(data) {
    var str = ''
    data.forEach(function (item) {
      str += `<li>姓名：${item.name}，性别：${item.sex}，年龄：${item.age}<a data-id="${item._id}">查看info</a></li>`
    })
    $('#studentList').html(str)
  }

  function renderCourse(data) {
    var str = ''
    data.forEach(function (item) {
      str += '<li>课程：' + item.title + '，简介：' + item.desc + '</li>'
    })
    $('#courseList').html(str)
  }
}