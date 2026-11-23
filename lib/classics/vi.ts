/**
 * Bản dịch tiếng Việt cho thư viện cổ thư.
 *
 * Nguyên văn chữ Hán trong data/*.ts giữ nguyên (tìm kiếm chữ Hán vẫn dùng được);
 * file này phủ lên: tên sách, triều đại, tác giả, giới thiệu, tên chương và
 * phần "Dịch nghĩa" (Paragraph.translation) của từng đoạn. Ghép trong lib/classics/index.ts.
 */

export interface BookVi {
  title: string;
  dynasty: string;
  author: string;
  intro: string;
  /** Theo thứ tự chương trong file dữ liệu: [tiêu đề, phụ đề] */
  chapters: [string, string?][];
}

export const BOOKS_VI: Record<string, BookVi> = {
  gusuifu: {
    title: 'Cốt Tủy Phú',
    dynasty: 'Đời Minh',
    author: 'Truyền thừa cổ thư Tử Vi (không rõ tác giả)',
    intro: 'Khẩu quyết cốt lõi, cô đọng nhất của Tử Vi Đẩu Số, khoảng 1.500 chữ. «Thiên Kỷ» của Nghê Hải Hạ dẫn bài phú này nhiều lần; là kinh điển người học Tử Vi phải đọc.',
    chapters: [
      ['Tổng luận', 'Lập luận cơ bản của Tử Vi Đẩu Số'],
      ['Luận sao Tử Vi', 'Ngôi đế tôn quý, có phò tá thì quý'],
      ['Luận sao Thất Sát', 'Tướng tinh cô độc, hợp võ chức'],
      ['Cách Sát Phá Lang', 'Số khai phá, xông pha, biến động'],
      ['Cách Cơ Nguyệt Đồng Lương', 'Ổn định tích lũy, hợp công chức'],
      ['Luận Tứ Hóa', 'Cát hung của Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ'],
      ['Luận Phụ Bật Khôi Việt', 'Cái quý của lục cát tinh'],
      ['Luận lục sát tinh', 'Cái hung của Kình Đà Hỏa Linh Không Kiếp'],
      ['Luận mười hai cung', 'Tượng chủ và cát hung của từng cung'],
    ],
  },
  quanji: {
    title: 'Tử Vi Đẩu Số Toàn Tập',
    dynasty: 'Đời Minh',
    author: 'Tương truyền do Trần Đoàn tổ sư truyền lại',
    intro: 'Một trong những cổ thư Tử Vi Đẩu Số có uy tín nhất, tương truyền do Trần Đoàn tổ sư đời Tống truyền dạy. Là nguồn dẫn chứng cốt lõi của hệ «Thiên Kỷ» của Nghê Hải Hạ.',
    chapters: [
      ['Quyển 1 · Tổng luận', 'Phép lập cơ bản của Tử Vi Đẩu Số'],
      ['Quyển 2 · Luận sao Tử Vi', 'Ngôi đế tôn quý'],
      ['Quyển 3 · Luận sáu sao Nam Đẩu', 'Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương'],
      ['Quyển 4 · Luận sáu sao Bắc Đẩu', 'Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Liêm Trinh, Phá Quân'],
      ['Quyển 5 · Luận Tứ Hóa và cách cục', 'Sức của Tứ Hóa và các cách cục quan trọng'],
    ],
  },
  quanshu: {
    title: 'Tử Vi Đẩu Số Toàn Thư',
    dynasty: 'Đời Minh',
    author: 'La Hồng Tiên biên soạn',
    intro: 'Cổ thư Tử Vi Đẩu Số có hệ thống nhất, nhấn mạnh quan hệ giữa mười hai cung và Tứ Hóa. Là giáo trình chính của người học Tử Vi từ đời Thanh trở đi.',
    chapters: [
      ['Luận mười hai cung · Cung Mệnh', 'Gốc rễ của việc xem số'],
      ['Luận mười hai cung · Cung Tài Bạch', 'Nơi nguồn tiền'],
      ['Luận mười hai cung · Cung Quan Lộc', 'Gốc của sự nghiệp'],
      ['Luận mười hai cung · Cung Phu Thê', 'Khí chất người phối ngẫu'],
      ['Luận Tứ Hóa', 'Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ'],
      ['Cách Cơ Nguyệt Đồng Lương', 'Số ổn định tích lũy'],
      ['Cách Song Lộc triều viên', 'Giàu sánh Đào Chu'],
    ],
  },
};

/** Dịch nghĩa từng đoạn, theo id đoạn. */
export const PARAGRAPH_VI: Record<string, string> = {
  // ── Cốt Tủy Phú ──
  'gsf-1-1': 'Thái cực tinh diệu là chủ của các sao. Tử Vi ngôi đế, là sao tôn quý nhất. Thiên Phủ là lệnh tinh, Nam Bắc Đẩu có Hóa Lộc, Hóa Quyền, lệnh tinh; Tả Phù, Hữu Bật là sao chủ việc tế tự.',
  'gsf-1-2': 'Tử Vi là vua, lấy Tả Phù, Hữu Bật làm tướng. Thiên Phủ là bề tôi, lấy Lộc Tồn làm kho. Thiên Cơ là thiện, Thiên Lương là ấm, gặp thì cát; Liêm Trinh là tù, Phá Quân là hao, gặp thì hung.',
  'gsf-1-3': 'Chỗ cốt yếu khi xem số là xem cung Mệnh trước. Chính tinh cung Mệnh định cách cục, Tam Phương Tứ Chính định chỗ dụng võ. Kế đến xem cung Thân, cung Thân định cảnh về già và nơi nương tựa. Rồi xem Đại Hạn, Lưu Niên để định nhịp tiến lui cả đời.',
  'gsf-2-1': 'Tử Vi là sao ngôi đế: có Tả Hữu thì quý, có Xương Khúc thì thanh tú, có Khôi Việt thì có quý nhân nâng đỡ. Tử Vi ngồi một mình không phò tá thì dù quý cũng không lâu; được cát tinh Tam Phương Tứ Chính chiếu về mới là đại cách chính tông.',
  'gsf-2-2': 'Tử Vi ở Tý, Ngọ là cái quý «quay mặt về nam, tựa lưng phương bắc», chủ đại phú đại quý; Tử Vi ở Sửu, Mùi đồng cung Phá Quân, chủ cương nghị quả quyết; Tử Vi ở Dần, Thân đồng cung Thiên Phủ, gọi là cách «Tử Phủ đồng cung», chủ phẩm hạnh đoan chính, cơm áo đầy đủ.',
  'gsf-2-3': 'Tử Vi ở Quan Lộc, không bị sát tinh xung phá, ắt làm quan cao; Tử Vi ở Điền Trạch, chủ có tổ nghiệp lại tự tạo dựng được; Tử Vi ở Phu Thê, chủ người phối ngẫu đoan trang, khí chất khác thường, nhưng nên cưới muộn, không nên cưới sớm.',
  'gsf-2-4': 'Tử Vi kỵ Không Kiếp, chủ có địa vị mà không có lộc. Tử Vi kỵ «vua cô độc không phò tá», chủ như đỉnh núi trơ trọi, khó thành việc lớn. Tử Vi Hóa Quyền chủ độc đoán, Tử Vi Hóa Khoa chủ danh tiếng, Tử Vi Hóa Kỵ chủ bị người khác kiềm chế.',
  'gsf-3-1': 'Thất Sát là tướng tinh, tính cương nghị quả quyết. Thất Sát thủ Mệnh không thích đồng cung với các cát tinh, đi con đường riêng mới là bản cách. Thất Sát gặp Không Kiếp chủ cô độc phiêu bạt, sự nghiệp khó thành.',
  'gsf-3-2': 'Cách Thất Sát triều Đẩu: Thất Sát ở Tý, Ngọ, Dần, Thân, cung đối có Tử Vi, Thiên Phủ chiếu, chủ tước lộc vinh xương. Hợp nhất với quân đội, công an, võ chức, mở mang bờ cõi. Cả đời quý khí khó cản, nhưng phải qua rèn luyện mới thành đại khí.',
  'gsf-3-3': 'Thất Sát gặp Kình Đà chủ thương tích, huyết quang; gặp Hỏa Linh chủ uy vũ cương liệt; gặp Hóa Lộc chủ võ quý cả đời; gặp Hóa Kỵ thì ngược lại, chủ sa sút, sự nghiệp nhiều thất bại.',
  'gsf-4-1': 'Ba sao Thất Sát, Phá Quân, Tham Lang hội ở Mệnh, Thiên Di, Tài Bạch, Quan Lộc gọi là «cách Sát Phá Lang». Chủ đời nhiều biến động, không cam chịu tầm thường, hợp khởi nghiệp, quân đội, công an, kinh doanh. Lúc trẻ dễ bốc đồng mà thất bại, sau trung niên mới ổn định giữ được thành quả.',
  'gsf-4-2': 'Tam Phương của Sát Phá Lang có Hóa Lộc hoặc Hóa Quyền thì động mà có lực, làm được việc lớn; nếu Tam Phương sát tinh quá nặng (Kình Đà Hỏa Linh cùng chiếu) thì động mà không thành, nên tĩnh giữ.',
  'gsf-5-1': 'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Thiên Di, Tài Bạch, Quan Lộc gọi là «cách Cơ Nguyệt Đồng Lương». Chủ nho nhã, thông minh giỏi mưu tính. Hợp nhất công chức, học thuật, văn nghệ, y tế, dịch vụ — những ngành cần tích lũy ổn định, không nên mạo hiểm, đầu cơ lớn.',
  'gsf-5-2': 'Cơ Nguyệt Đồng Lương làm lại nhân — người xưa nói cách này hợp làm công chức, việc hành chính văn thư, yên ổn cả đời. Hội thêm Xương Khúc, Hóa Khoa thì danh tiếng vang xa. Kỵ nhất sát tinh quá nhiều, khi đó lại chủ nhiều biến đổi, khó yên.',
  'gsf-6-1': 'Hóa Lộc chủ tài, chủ duyên, chủ biến năng lực thành tiền; Hóa Quyền chủ quyền, chủ quyết đoán, chủ tự gánh vác một mảng; Hóa Khoa chủ danh, chủ quý nhân, chủ văn thư; Hóa Kỵ chủ bệnh, chủ sát, chủ bài học sâu sắc.',
  'gsf-6-2': 'Hóa Lộc nhập Mệnh, nguồn tiền rộng mở; Hóa Quyền nhập Mệnh, gánh được trọng trách; Hóa Khoa nhập Mệnh, danh tiếng vang xa; Hóa Kỵ nhập Mệnh, phải qua rèn luyện mới thành người.',
  'gsf-6-3': 'Hóa Kỵ nhập Tài Bạch, chủ tiền đến rồi đi; nhập Quan Lộc, chủ sự nghiệp trắc trở; nhập Phu Thê, chủ hôn nhân nhiều sóng gió; nhập Tử Tức, chủ duyên con cái mỏng hoặc cha mẹ con cái va chạm.',
  'gsf-6-4': 'Lộc Tồn và Hóa Lộc cùng hội ở Tam Phương cung Mệnh gọi là «Song Lộc triều viên», chủ giàu sánh Đào Chu; Hóa Khoa và Hóa Quyền cùng hội gọi là «Khoa Quyền song hội», chủ danh và quyền đều đẹp.',
  'gsf-7-1': 'Tả Phù, Hữu Bật là «tướng tinh», chủ trợ lực, quý nhân; Văn Xương, Văn Khúc là «văn tinh», chủ thông minh tuấn tú; Thiên Khôi, Thiên Việt là «sao quý nhân», chủ lúc then chốt có người nâng đỡ.',
  'gsf-7-2': 'Lục cát tinh cùng hội ở Tam Phương Tứ Chính cung Mệnh, chủ cả đời quý nhân không dứt, rất được lòng người. Dù mệnh cách bình thường cũng nhờ sức lục cát mà làm nên sự nghiệp khác thường.',
  'gsf-7-3': 'Phụ Bật giáp Mệnh: Tả Phù, Hữu Bật kẹp hai cung trước sau cung Mệnh, chủ cả đời có quý nhân nâng đỡ, gặp khó có người giúp. Hợp nhất khi đồng cung với Tử Vi, gọi là cách «Quân thần khánh hội».',
  'gsf-8-1': 'Kình Dương, Đà La là «sát tinh», chủ huyết quang, thị phi, trở ngại; Hỏa Tinh, Linh Tinh là «táo tinh», chủ bốc đồng, nóng nảy, thương tai; Địa Không, Địa Kiếp là «không vong», chủ hao tiền, hư danh, không thực.',
  'gsf-8-2': 'Sát tinh không hoàn toàn là hung — sát tinh như hòn đá mài dao, có thể rèn ra sức phá cục người thường không có. Lúc trẻ dễ bốc đồng tự hại, sau trung niên mới hóa sát thành quyền.',
  'gsf-8-3': 'Dương Đà giáp Kỵ: Kình Dương, Đà La kẹp cung có Hóa Kỵ, chủ đại hung. Năm đó, Đại Hạn đó phải đặc biệt cảnh giác huyết quang, kiện tụng, biến cố lớn.',
  'gsf-8-4': 'Không Kiếp giáp Mệnh: Địa Không, Địa Kiếp kẹp hai cung trước sau cung Mệnh, chủ cả đời hợp việc hư (tinh thần) hơn việc thực, nên làm văn nghệ, tôn giáo, huyền học… những ngành «phi thực», không nên kinh doanh đầu tư.',
  'gsf-9-1': 'Cung Mệnh là gốc, Tam Phương là dụng: Tài Bạch chủ nguồn tiền, Quan Lộc chủ sự nghiệp, Thiên Di chủ duyên bên ngoài. Tam Phương Tứ Chính có cát tinh chiếu thì mệnh cách mới phát huy trọn vẹn.',
  'gsf-9-2': 'Cung Phu Thê xem khí chất người phối ngẫu, cung Tử Tức xem duyên con cái, cung Tật Ách xem điểm yếu của cơ thể, cung Thiên Di xem vận ra ngoài. Chính tinh và Tứ Hóa của từng cung quyết định cát hung tiến lui của lĩnh vực đó.',
  'gsf-9-3': 'Cung Điền Trạch là kho tiền của lá số, giữ được chính tài hay không xem cung này; cung Phúc Đức là hưởng thụ tinh thần, lòng có yên hay không xem cung này; cung Phụ Mẫu là quan hệ với bề trên, cũng chủ văn thư hợp đồng.',
  'gsf-9-4': 'Cung vô chính diệu mượn cung đối để luận — cung nào không có chính tinh thì mượn chính tinh cung đối để luận việc của cung đó. Ví dụ cung Mệnh vô chính diệu thì mượn chính tinh cung Thiên Di để định mệnh cách.',

  // ── Tử Vi Đẩu Số Toàn Tập ──
  'qj-1-1': 'Tử Vi Đẩu Số do Trần Đoàn tổ sư truyền lại, lấy Tử Vi làm ngôi đế, thống lĩnh trăm sao. Mỗi sao có chỗ chủ riêng, có phân Miếu, Vượng, Lợi, Hãm, có khác biệt cát hung khi hội chiếu. Người xem số trước hết phải an sao, kế định cung Mệnh, cung Thân, thứ ba xem cát hung mười hai cung, thứ tư xét phi hóa của Đại Hạn, Lưu Niên.',
  'qj-1-2': 'Phép an sao: trước lấy can năm khởi Tử Vi; vị trí cung Tử Vi định xong thì các sao đều theo phép mà xếp vào mười hai cung. Mười bốn chính tinh ở đúng vị trí, lục cát lục sát phụ theo. Một lá số đã định thì vạn tượng đều hiện.',
  'qj-1-3': 'Cung Mệnh là gốc, chủ cách cục cả đời; cung Thân là phụ, chủ hướng đi sau ba mươi tuổi. Mệnh Thân phân minh mới biết sự tiến lui của một người. Tam Phương Tứ Chính hội chiếu mới biết chỗ dụng võ của người đó. Mười hai cung mỗi cung có chỗ chủ riêng, mới thấy toàn cảnh đời người.',
  'qj-2-1': 'Tử Vi là chủ Bắc Đẩu, thống lĩnh các sao. Tử Vi thuộc Thổ, là sao tôn quý. Trong số là ngôi đế, hóa khí là Tôn, chủ trung hậu có uy nghi, đi con đường riêng. Mệnh nam, mệnh nữ đều thích Tử Vi thủ Mệnh, nhưng phải có Tả Phù, Hữu Bật triều về mới là chính cách.',
  'qj-2-2': 'Tử Vi ngồi một mình cần có Tả Hữu, Xương Khúc, Khôi Việt kẹp giữ mới dùng được — Tử Vi đơn độc không nương tựa thì dù quý cũng không lâu; được cát tinh Tam Phương Tứ Chính chiếu về mới là đại cách Quân thần khánh hội.',
  'qj-2-3': 'Tử Vi ở cung Huynh Đệ thì anh em có quý khí, tự lập nổi bật, thường được anh cả giúp; Tử Vi ở Tử Tức thì con cái có quý khí, nhưng dạy dỗ cần công bằng; Tử Vi ở Phu Thê thì người phối ngẫu đoan trang, nhưng nên cưới muộn, không nên sớm.',
  'qj-2-4': 'Tử Vi ở Điền Trạch, chủ có tổ nghiệp lại tự tạo dựng được, nhà đất có thể là trục chính để làm giàu; Tử Vi ở Phúc Đức, đời sống tinh thần coi trọng phong cách, lòng tự tôn cao; Tử Vi ở Quan Lộc, chủ đại phú quý, nên ở vị trí cao.',
  'qj-3-1': 'Thiên Phủ thuộc Thổ, là lệnh tinh Nam Đẩu, chủ kho lộc. Thiên Phủ ngồi một mình chủ phẩm hạnh đoan chính, cơm áo không lo. Thiên Phủ đồng cung Tử Vi gọi là «Tử Phủ đồng cung», chủ tôn quý. Thiên Phủ thích nhất gặp Lộc Tồn, gọi là «Song Lộc triều viên», chủ đại phú.',
  'qj-3-2': 'Thái Âm là chủ tinh trung thiên, thuộc Thủy. Thái Âm Miếu Vượng chủ nhà đất, phú quý; Hãm thì chủ vất vả, bôn ba. Mệnh nữ có Thái Âm tốt nhất, chủ xinh đẹp hiền thục. Thái Âm ở Hợi, Tý chủ đại phú; ở Ngọ, Mùi thì giảm lực.',
  'qj-3-3': 'Tham Lang là sao đào hoa, dục vọng, thuộc Mộc và Thủy. Tham Lang chủ đa tài nghệ, giao tiếp rộng. Tham Lang gặp Hỏa Tinh gọi là «cách Hỏa Tham», gặp Linh Tinh gọi là «cách Linh Tham», đều chủ thiên tài phát bất ngờ. Nhưng Tham Lang kỵ Không Kiếp, chủ hào nhoáng mà không thực.',
  'qj-3-4': 'Cự Môn thuộc Thủy, hóa khí là Ám, chủ khẩu thiệt thị phi. Cự Môn là sao khẩu tài, hợp luật sư, giáo viên, truyền thông. Cự Môn Hóa Lộc chủ «kiếm tiền bằng miệng», Hóa Kỵ thì thị phi kiện tụng không dứt. Cự Môn kỵ nhất ở Sửu, Mùi đồng cung Thái Dương, gọi là «Nhật Nguyệt phản bối».',
  'qj-3-5': 'Thiên Tướng thuộc Thủy, hóa khí là Ấn, là sao phò tá. Thiên Tướng trung hậu thật thà, hợp hành chính, thư ký, pháp chế. Thiên Tướng không thích ngồi một mình, hợp nhất đồng cung với Tử Vi hoặc Liêm Trinh, mượn uy nghi của họ mà thành việc.',
  'qj-3-6': 'Thiên Lương thuộc Thổ, hóa khí là Ấm, là sao lão nhân. Thiên Lương chủ lương thiện, từ bi, cô khắc, hóa giải. Thiên Lương hợp luật, y, giáo dục, tôn giáo. Thiên Lương Hóa Khoa chủ danh tiếng, Hóa Lộc thì ngược lại, phù phiếm.',
  'qj-4-1': 'Tử Vi thuộc Thổ, đã luận ở quyển hai.',
  'qj-4-2': 'Thiên Cơ thuộc Mộc, hóa khí là Thiện, là sao trí tuệ. Thiên Cơ chủ thông minh, biến báo, hiếu động. Thiên Cơ nhập Mệnh thì tư duy nhanh nhạy, hợp tư vấn, hoạch định, văn hóa giáo dục. Thiên Cơ kỵ nhất hay đổi mà không có chủ kiến, cần Văn Xương, Văn Khúc chiếu mới thành người.',
  'qj-4-3': 'Thái Dương thuộc Hỏa, hóa khí là Quý, là sao quý của nam. Thái Dương chủ danh dự, việc công, giao tế. Thái Dương Miếu Vượng chủ đại quý, Hãm thì vất vả mà không được gì. Thái Dương hợp nhất ở Mão, Thìn, Tỵ, Ngọ; rơi vào Tuất, Hợi, Tý, Sửu thì giảm lực.',
  'qj-4-4': 'Vũ Khúc thuộc Kim, hóa khí là Tài, là chủ của tài tinh. Vũ Khúc chủ cương nghị quả quyết, giỏi quản lý tiền và kinh doanh. Vũ Khúc Hóa Kỵ chủ phẫu thuật, huyết quang, tai nạn kim loại. Vũ Khúc ở Sửu, Mùi đồng cung Thất Sát gọi là cách «Vũ Khúc Thất Sát», chủ cương trực, võ quý.',
  'qj-4-5': 'Liêm Trinh thuộc Hỏa và Mộc, hóa khí là Tù, là thứ đào hoa tinh. Liêm Trinh văn võ kiêm toàn, đa tài nghệ. Liêm Trinh Hóa Kỵ chủ huyết quang, kiện tụng, rắc rối tình cảm. Liêm Trinh đồng cung Thiên Tướng là «cách Liêm Tướng», chủ tiếng thanh liêm.',
  'qj-4-6': 'Phá Quân thuộc Thủy, hóa khí là Hao, là sao phá cũ đổi mới. Phá Quân chủ khai sáng, biến động, duyên lục thân mỏng. Phá Quân hợp dựa vào chuyên môn kỹ thuật mà đi khắp nơi. Phá Quân Hóa Lộc gọi là «phá rồi mới lập», chủ trước tán sau tụ.',
  'qj-5-1': 'Hóa Lộc chủ nguồn tiền, chủ duyên phận, chủ biến năng lực thành tiền. Hóa Lộc nhập Tam Phương cung Mệnh, chủ nguồn tiền rộng mở; Hóa Lộc nhập Tài Bạch, chủ tiền ra vào đều, chính tài ổn định.',
  'qj-5-2': 'Hóa Quyền chủ quyền lực, chủ quyết đoán, chủ gánh vác. Hóa Quyền nhập Mệnh, chủ tự gánh vác được một mảng; Hóa Quyền nhập Quan Lộc, chủ sự nghiệp có sức kiểm soát, nên đi đường quản lý hoặc chuyên gia kỹ thuật.',
  'qj-5-3': 'Hóa Khoa chủ danh tiếng, chủ văn thư, chủ quý nhân. Hóa Khoa nhập Mệnh, chủ danh tiếng vang xa; Hóa Khoa nhập Thân, chủ lấy danh mà được lợi, hợp văn hóa giáo dục, nghiên cứu, tư vấn.',
  'qj-5-4': 'Hóa Kỵ chủ bệnh, chủ sát, chủ bài học sâu sắc. Hóa Kỵ nhập Tam Phương cung Mệnh, chủ cả đời có một «điểm vướng» — đó là bài học sâu nhất trong mệnh cách, vượt qua được thì thành đại trí tuệ. Khoảng ba mươi tuổi là lúc Hóa Kỵ sắc bén nhất.',
  'qj-5-5': 'Cách Tử Phủ đồng cung: Tử Vi, Thiên Phủ cùng vào cung Mệnh, chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo. Cần Tả Phù, Hữu Bật phối hợp mới là đại cách trọn vẹn.',
  'qj-5-6': 'Cách Thất Sát triều Đẩu: Thất Sát ở Tý, Ngọ, Dần, Thân thủ Mệnh, cung đối có Tử Vi, Thiên Phủ chiếu, chủ tước lộc vinh xương — võ chức đại quý, hợp nhất quân đội, công an, chính giới hoặc lãnh đạo doanh nghiệp.',
  'qj-5-7': 'Cách Song Lộc triều viên: Hóa Lộc, Lộc Tồn cùng hội ở Tam Phương Tứ Chính cung Mệnh, nguồn tiền dồi dào, cơm áo đầy đủ. Người xưa nói «Song Lộc triều viên, giàu sánh Đào Chu», chủ cả đời không lo tiền.',
  'qj-5-8': 'Cách Cơ Nguyệt Đồng Lương: bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Thiên Di, Tài Bạch, Quan Lộc, chủ nho nhã, thông minh giỏi mưu tính. Hợp nhất công chức, học thuật, văn nghệ, y tế, dịch vụ — những ngành cần tích lũy ổn định.',
  'qj-5-9': 'Cách Sát Phá Lang: ba sao Thất Sát, Phá Quân, Tham Lang hội Mệnh, chủ đời nhiều biến động, không cam chịu tầm thường, hợp khởi nghiệp, quân đội, công an, kinh doanh, bán hàng. Sau trung niên mới ổn định giữ được thành quả.',
  'qj-5-10': 'Cách Nhật Nguyệt đồng cung: Thái Dương, Thái Âm cùng vào cung Sửu hoặc Mùi, chủ duyên khác giới tốt, sự nghiệp thuận lợi, danh tiếng vang xa. Ở cung Sửu lực bình thường, ở cung Mùi lực hơi giảm.',

  // ── Tử Vi Đẩu Số Toàn Thư ──
  'qs-1-1': 'Cung Mệnh là gốc rễ của một đời, then chốt của vạn sự. Cung Mệnh định thì cách cục cả đời định. Xem cung Mệnh trước xem chính tinh, kế xem phụ tinh và sát tinh, rồi xem Tứ Hóa và sự hội chiếu của Tam Phương Tứ Chính.',
  'qs-1-2': 'Chính tinh cung Mệnh Miếu Vượng chủ ưu thế bẩm sinh, làm việc một được hai; Hãm thì chủ bất lợi bẩm sinh, nhưng ngược lại chủ đại thành — người có sao Hãm được hai chữ «không cam» thúc đẩy, lại có thể bứt phá điều mà mệnh Miếu Vượng không làm được.',
  'qs-1-3': 'Cung Mệnh gặp lục cát tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt), chủ cả đời quý nhân không dứt; gặp lục sát tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp), chủ nhiều trắc trở rèn giũa, nhưng nhẫn qua được thì lại thành đại khí.',
  'qs-2-1': 'Cung Tài Bạch chủ nguồn tiền, thu nhập, cách quản lý tiền cả đời. Chính tinh cung Tài Bạch khác nhau thì cách kiếm tiền khác nhau: Tử Vi ở Tài chủ tiền từ chức vị, Vũ Khúc ở Tài chủ tiền buôn bán, Thái Âm ở Tài chủ tiền nhà đất, Cự Môn ở Tài chủ tiền từ tài ăn nói.',
  'qs-2-2': 'Cung Tài Bạch Hóa Lộc nhập Mệnh, chủ nguồn tiền rộng mở; cung Tài Bạch Hóa Kỵ, chủ tiền đến rồi đi; cung Tài Bạch có Lộc Tồn, chủ tích lũy ổn định; cung Tài Bạch gặp Không Kiếp, chủ hao tiền, hư danh.',
  'qs-3-1': 'Cung Quan Lộc chủ sự nghiệp, địa vị, thành tựu xã hội. Chính tinh cung Quan Lộc khác nhau thì hướng sự nghiệp khác nhau: Tử Vi ở Quan hợp vị trí cao ở nơi lớn, Thái Dương ở Quan hợp việc công, danh tiếng, Vũ Khúc ở Quan hợp tài chính, sản xuất, Liêm Trinh ở Quan hợp văn võ kiêm toàn.',
  'qs-3-2': 'Cung Quan Lộc Hóa Quyền nhập Mệnh, chủ tự gánh vác được một mảng; Hóa Lộc nhập Quan Lộc, chủ tiền đến từ nghề nghiệp; Hóa Kỵ nhập Quan Lộc, chủ trắc trở chốn công sở.',
  'qs-4-1': 'Cung Phu Thê chủ khí chất người phối ngẫu, tình trạng hôn nhân. Phu Thê có Tử Vi chủ người phối ngẫu đoan trang, có uy quyền, nên cưới muộn; Phu Thê có Tham Lang chủ người phối ngẫu đa tình, đào hoa nặng; Phu Thê có Thiên Lương chủ người phối ngẫu chín chắn, điềm đạm, lớn tuổi hơn.',
  'qs-4-2': 'Cung Phu Thê Hóa Kỵ xung Mệnh, chủ hôn nhân nhiều sóng gió. Cung Phu Thê gặp lục sát, cần đặc biệt chú ý thử thách trong tình cảm. Cung Phu Thê gặp lục cát, chủ người phối ngẫu là quý nhân.',
  'qs-5-1': 'Tứ Hóa là tinh hoa của lá số — Hóa Lộc chủ tài, Hóa Quyền chủ thế, Hóa Khoa chủ danh, Hóa Kỵ chủ bệnh. Cung có Tứ Hóa quyết định các mốc sự kiện lớn trong đời.',
  'qs-5-2': 'Tứ Hóa năm sinh là Tứ Hóa bản mệnh, cố định mãi mãi; thầy Nghê nhấn mạnh sao Tứ Hóa không động, chỉ xem Đại Hạn, Lưu Niên đi đến đâu. Tự Hóa, phi hóa can cung, cung Lai Nhân… của Bắc phái Phi Tinh, thầy Nghê không chủ trương dùng.',
  'qs-5-3': 'Hóa Lộc nhập Tam Phương Tứ Chính cung Mệnh: nguồn tiền ổn định, duyên rộng, năng lực biến thành tiền được. Hóa Lộc nhập Phu Thê: hôn nhân ngọt ngào. Hóa Lộc nhập Quan Lộc: sự nghiệp và nguồn tiền đi cùng nhau.',
  'qs-5-4': 'Hóa Kỵ nhập Tam Phương Tứ Chính cung Mệnh: cả đời có bài học sâu sắc, nên đối diện thay vì trốn tránh. Hóa Kỵ nhập Phu Thê: hôn nhân nhiều thử thách. Hóa Kỵ nhập Quan Lộc: sự nghiệp nhiều trắc trở, nhưng sau rèn luyện lại thành người chuyên nghiệp.',
  'qs-6-1': 'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Tam Phương Tứ Chính cung Mệnh gọi là cách Cơ Nguyệt Đồng Lương. Nho nhã, thông minh giỏi mưu tính, hợp nhất công chức, học thuật, văn nghệ, y tế, dịch vụ — những ngành cần tích lũy ổn định.',
  'qs-6-2': 'Cơ Nguyệt Đồng Lương làm lại nhân — người xưa nói cách này hợp làm công chức, việc hành chính văn thư, yên ổn cả đời. Hội thêm Xương Khúc, Hóa Khoa thì danh tiếng vang xa. Kỵ nhất sát tinh quá nhiều, khi đó lại chủ nhiều biến đổi, khó yên.',
  'qs-7-1': 'Hóa Lộc và Lộc Tồn cùng hội ở Tam Phương Tứ Chính cung Mệnh gọi là cách Song Lộc triều viên. Người xưa nói «Song Lộc triều viên, giàu sánh Đào Chu», chủ cả đời không lo tiền, thường được cả chính tài lẫn hoạnh tài.',
  'qs-7-2': 'Song Lộc triều viên kỵ nhất Không Kiếp — Không Kiếp xung vào thì Song Lộc thành hư danh. Cần gặp Tả Phù, Hữu Bật hoặc Văn Xương, Văn Khúc mới là chính cách.',
};
