class Response {
  constructor(data = null, message = "") {
    this.data = data;
    this.message = message;
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "İşlem başarılı",
    });
  }

  create(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "İşlem başarılı",
    });
  }

  error400(res) {
    return res.status(400).json({
      success: false,
      message: this.message ? this.message : "İşlem başarısız",
    });
  }

  error401(res) {
    return res.status(401).json({
      success: false,
      message: this.message ? this.message : "Yetkisiz erişim",
    });
  }

  error404(res) {
    return res.status(404).json({
      success: false,
      message: this.message ? this.message : "Kayıt bulunamadı",
    });
  }

  error422(res) {
    return res.status(422).json({
      success: false,
      message: this.message ? this.message : "Geçersiz veri",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      message: this.message ? this.message : "Sunucu hatası",
    });
  }
}

module.exports = Response;
