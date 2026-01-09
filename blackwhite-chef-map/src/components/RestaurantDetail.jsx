function RestaurantDetail({ restaurant, onClose }) {
  if (!restaurant) return null;

  const handleReservationClick = () => {
    if (restaurant.reservation?.url) {
      window.open(restaurant.reservation.url, '_blank');
    }
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        {/* 헤더 */}
        <div className="detail-header">
          <div className="detail-badges">
            <span className={`team-badge large ${restaurant.team}`}>
              {restaurant.team === 'black' ? '흑수저' : '백수저'}
            </span>
            <span className="season-badge">시즌 {restaurant.season}</span>
            {restaurant.rank && <span className="rank-badge">{restaurant.rank}</span>}
          </div>
          <h1 className="detail-restaurant-name">{restaurant.restaurant}</h1>
          <p className="detail-chef-name">{restaurant.chef} 셰프</p>
          <p className="detail-category">{restaurant.category}</p>
        </div>

        {/* 예약 섹션 - 가장 중요! */}
        <div className="reservation-section">
          <h2>예약 방법</h2>
          <div className="reservation-info">
            <div className="reservation-type">
              <span className="reservation-label">예약 플랫폼</span>
              <span className="reservation-value">{restaurant.reservation?.type || '전화예약'}</span>
            </div>
            {restaurant.reservation?.note && (
              <p className="reservation-note">{restaurant.reservation.note}</p>
            )}
            {restaurant.reservation?.url ? (
              <button className="reservation-btn" onClick={handleReservationClick}>
                {restaurant.reservation.type === '캐치테이블' && (
                  <span className="btn-icon">📱</span>
                )}
                {restaurant.reservation.type}에서 예약하기
              </button>
            ) : (
              <div className="phone-reservation">
                <span className="phone-icon">📞</span>
                <span className="phone-number">{restaurant.phone || '전화번호 확인 필요'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="detail-section">
          <h2>기본 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div className="info-content">
                <span className="info-label">주소</span>
                <span className="info-value">{restaurant.address}</span>
              </div>
            </div>
            {restaurant.phone && (
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div className="info-content">
                  <span className="info-label">전화번호</span>
                  <span className="info-value">{restaurant.phone}</span>
                </div>
              </div>
            )}
            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div className="info-content">
                <span className="info-label">영업시간</span>
                <span className="info-value">{restaurant.openingHours}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">💰</span>
              <div className="info-content">
                <span className="info-label">가격대</span>
                <span className="info-value">{restaurant.priceRange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="detail-section">
          <h2>소개</h2>
          <p className="detail-description">{restaurant.description}</p>
        </div>

        {/* 시그니처 메뉴 */}
        {restaurant.signature && restaurant.signature.length > 0 && (
          <div className="detail-section">
            <h2>시그니처 메뉴</h2>
            <div className="signature-tags">
              {restaurant.signature.map((item, index) => (
                <span key={index} className="signature-tag">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* SNS */}
        {restaurant.instagram && (
          <div className="detail-section">
            <h2>SNS</h2>
            <a
              href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              <span className="instagram-icon">📷</span>
              {restaurant.instagram}
            </a>
          </div>
        )}

        {/* 추가 노트 */}
        {restaurant.note && (
          <div className="detail-note">
            <span className="note-icon">ℹ️</span>
            {restaurant.note}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;
