export const CustomerService = {
  getCustomers (params) {
    return fetch('http://192.168.1.180:3000/rsses').then((res) =>
      res.json()
    )
  },
  getColumns (params) {
    console.log(Object.keys(params[0]))
    console.log(Object.keys(params[0]).length)
    var jsonArr = []
    for (var i = 0; i < Object.keys(params[0]).length; i++) {
      console.log(Object.keys(params[0])[i])
      const key = Object.keys(params[0])[i]
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        jsonArr.push({
          field: Object.keys(params[0])[i],
          header: Object.keys(params[0])[i]
        })
      }
    }
    console.log(jsonArr)
    return jsonArr
  }

}
