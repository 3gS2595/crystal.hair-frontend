export const ContentService = {
  getContent (params) {
    return fetch('http://192.168.1.180:3000/rsses').then((res) =>
      res.json()
    )
  },
  getColumns (params) {
    var jsonArr = []
    console.log(Object.keys(params[0]))
    var ret = structuredClone(params[0])
    var c = 'date'
    if (Object.keys(params[0]).indexOf(c) > -1) {
      const index = Object.keys(ret).indexOf(c)
      jsonArr.push({
        field: Object.keys(ret)[index],
        header: Object.keys(ret)[index]
      })
      delete ret.date
    }

    c = 'title'
    if (Object.keys(ret).indexOf(c) > -1) {
      const index = Object.keys(ret).indexOf(c)
      jsonArr.push({
        field: Object.keys(ret)[index],
        header: Object.keys(ret)[index]
      })
      delete ret.title
    }

    for (var i = 0; i < Object.keys(ret).length; i++) {
      const key = Object.keys(ret)[i]
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        jsonArr.push({
          field: key,
          header: key
        })
      }
    }
    return jsonArr
  }
}
