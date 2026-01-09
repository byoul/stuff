import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/restaurants`)
      const json = await res.json()
      if (json.success) {
        setRestaurants(json.data)
      } else {
        setError(json.error)
      }
    } catch (e) {
      setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
    }
    setLoading(false)
  }

  const refresh = async () => {
    await fetch(`${API_URL}/api/refresh`, { method: 'POST' })
    fetchRestaurants()
  }

  const filtered = restaurants.filter(r => {
    if (filter === 'available') return !r.reservationStatus?.includes('마감')
    if (filter === 'michelin') return r.michelinStar || r.michelinBib
    return true
  })

  return (
    <div className="container">
      <header>
        <h1>흑백요리사 시즌2 예약 정보</h1>
        <p className="subtitle">캐치테이블 예약 정보만 모아서 보기</p>
      </header>

      <div className="controls">
        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            전체 ({restaurants.length})
          </button>
          <button
            className={filter === 'available' ? 'active' : ''}
            onClick={() => setFilter('available')}
          >
            예약 가능
          </button>
          <button
            className={filter === 'michelin' ? 'active' : ''}
            onClick={() => setFilter('michelin')}
          >
            미쉐린
          </button>
        </div>
        <button className="refresh-btn" onClick={refresh} disabled={loading}>
          {loading ? '로딩 중...' : '새로고침'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>캐치테이블에서 데이터를 가져오는 중...</p>
          <p className="loading-sub">첫 로딩은 1-2분 정도 걸릴 수 있습니다</p>
        </div>
      ) : (
        <div className="restaurant-list">
          {filtered.map((r, i) => (
            <div key={i} className="restaurant-card">
              <div className="card-header">
                <div className="chef-info">
                  <span className="chef-name">{r.chef}</span>
                  {r.michelinStar && <span className="michelin">⭐ {r.michelinStar}스타</span>}
                  {r.michelinBib && <span className="michelin bib">빕구르망</span>}
                </div>
                <h2 className="shop-name">{r.name || '매장명 미확인'}</h2>
              </div>

              <div className="card-body">
                <div className="info-row">
                  {r.location && <span className="location">📍 {r.location}</span>}
                  {r.cuisine && <span className="cuisine">{r.cuisine}</span>}
                </div>

                {r.rating && (
                  <div className="info-row">
                    <span className="rating">★ {r.rating}</span>
                    {r.reviewCount && <span className="reviews">리뷰 {r.reviewCount}개</span>}
                  </div>
                )}

                {r.priceInfo && <div className="price">{r.priceInfo}</div>}
                {r.hours && <div className="hours">{r.hours}</div>}

                <div className="reservation-info">
                  {r.reservationStatus && (
                    <div className={`status ${r.reservationStatus.includes('마감') ? 'closed' : 'open'}`}>
                      {r.reservationStatus}
                    </div>
                  )}
                  {r.reservationOpenTime && (
                    <div className="open-time">🕐 {r.reservationOpenTime}</div>
                  )}
                  {r.reservationPeriod && (
                    <div className="period">📅 {r.reservationPeriod}</div>
                  )}
                </div>
              </div>

              {r.shopUrl && (
                <a
                  href={r.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reserve-btn"
                >
                  캐치테이블에서 예약하기
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
