export const CustomerService = {
  getCustomers (params) {
    return fetch('http://192.168.1.180:3000/rsses').then((res) =>
      res.json()
    )
  }
}
