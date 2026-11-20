export const metadata = { title: 'Điều khoản dịch vụ · Lá số Tử Vi', description: 'Điều khoản dịch vụ và thỏa thuận người dùng của Lá số Tử Vi' };

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Về trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>Lá số Tử Vi</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản dịch vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: tháng 4/2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Tổng quan dịch vụ</h2>
      <p>Lá số Tử Vi (sau đây gọi là "Trang") cung cấp dịch vụ lập và luận giải lá số theo hệ Tử Vi Đẩu Số «Thiên Kỷ» của Nghê Hải Hạ. Mọi nội dung mệnh lý trên Trang chỉ để tham khảo, <strong>không phải lời khuyên y tế, đầu tư, pháp lý, tư vấn tâm lý hay cho các quyết định quan trọng trong đời</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy tắc sử dụng</h2>
      <p>Khi sử dụng Trang, bạn đồng ý:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chỉ dùng Trang vào mục đích hợp pháp, tham khảo cá nhân</li>
        <li>Không phát tán nội dung của Trang để bán, đăng lại hoặc công bố công khai</li>
        <li>Không có hành vi gây rối hoạt động bình thường của Trang</li>
        <li>Thông tin ngày giờ sinh cung cấp là thật; Trang không chịu trách nhiệm về sai lệch luận giải do thông tin sai</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở hữu trí tuệ và điều cấm · Chống thu thập, chống huấn luyện</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>Mọi nội dung mệnh lý, kho kiến thức (gồm toàn bộ văn bản luận giải 14 chính tinh × 12 cung × nam nữ × Tứ Hóa × Đại Hạn, Lưu Niên), thiết kế giao diện, phương án tích hợp thuật toán và kho ví dụ đều do Trang tự xây dựng hoặc biên soạn hợp pháp.</strong><br/><br/>
        Nghiêm cấm các hành vi sau; Trang bảo lưu quyền yêu cầu bồi thường dân sự và truy cứu trách nhiệm hình sự với người vi phạm:<br/>
        ① Thu thập nội dung của Trang bằng bất kỳ phương tiện kỹ thuật nào như crawler, script tự động, gọi API hàng loạt;<br/>
        ② Dùng luận giải lá số, văn bản, dữ liệu phản hồi API do Trang tạo ra **để huấn luyện bất kỳ mô hình học máy nào** (bao gồm nhưng không giới hạn mô hình ngôn ngữ lớn, mô hình sinh mệnh lý, mô hình sinh văn bản…);<br/>
        ③ Bán lại hoặc đăng nội dung do Trang tạo ra lên trang web, ứng dụng, tài khoản mạng xã hội khác;<br/>
        ④ Dịch ngược, sao chép, sửa mã frontend hoặc backend của Trang rồi cung cấp dịch vụ tương tự dưới danh nghĩa "tự vận hành".<br/><br/>
        Văn bản do Trang xuất ra có gắn dấu vân tay truy vết; đầu ra từ việc sao chép / huấn luyện trái phép có thể bị phát hiện và truy vết. Khi phát hiện vi phạm, Trang có quyền yêu cầu <strong>bồi thường 1 triệu nhân dân tệ cho mỗi trường hợp vi phạm</strong>, và bảo lưu quyền khởi kiện ra tòa cũng như phối hợp điều tra với cơ quan công an.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Miễn trừ trách nhiệm</h2>
      <p>Nội dung mệnh lý của Trang được biên soạn từ kiến thức Tử Vi Đẩu Số truyền thống và hệ Nghê Hải Hạ, <strong>không bảo đảm chính xác 100%</strong>. Vận mệnh chịu ảnh hưởng chung của Thiên, Địa, Nhân; kết quả của Trang chỉ là tham khảo để hiểu bản thân, người dùng nên nhìn nhận lý trí, không nên quá phụ thuộc vào bất kỳ nhận định mệnh lý đơn lẻ nào.</p>
      <p>Trang không chịu trách nhiệm pháp lý về mọi hậu quả phát sinh từ việc sử dụng nội dung của Trang (bao gồm nhưng không giới hạn quyết định sai, ảnh hưởng tâm lý, thay đổi trong các mối quan hệ…).</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay đổi và chấm dứt dịch vụ</h2>
      <p>Trang bảo lưu quyền điều chỉnh, tạm dừng hoặc chấm dứt một phần hay toàn bộ dịch vụ bất cứ lúc nào. Thay đổi quan trọng sẽ được thông báo trên Trang hoặc qua email.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Luật áp dụng và giải quyết tranh chấp</h2>
      <p>Điều khoản này áp dụng pháp luật nước Cộng hòa Nhân dân Trung Hoa. Khi có tranh chấp, hai bên thương lượng thiện chí; nếu không thành, đưa ra tòa án nhân dân có thẩm quyền nơi đơn vị vận hành Trang đặt trụ sở.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Liên hệ</h2>
      <p>Nếu có thắc mắc, vui lòng liên hệ qua WeChat / email chăm sóc khách hàng mà Trang công bố.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách bảo mật</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </>
  );
}
