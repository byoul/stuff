import { seasons } from '../data/restaurants';

function RestaurantList({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  teamFilter,
  onTeamFilterChange,
  seasonFilter,
  onSeasonFilterChange
}) {
  return (
    <div className="restaurant-list">
      <div className="list-header">
        <h2>셰프 레스토랑 목록</h2>

        {/* 시즌 필터 */}
        <div className="filter-group">
          <label className="filter-label">시즌</label>
          <div className="filter-buttons">
            {seasons.map((season) => (
              <button
                key={season.id}
                className={`filter-btn season ${seasonFilter === season.id ? 'active' : ''}`}
                onClick={() => onSeasonFilterChange(season.id)}
              >
                {season.label}
              </button>
            ))}
          </div>
        </div>

        {/* 팀 필터 */}
        <div className="filter-group">
          <label className="filter-label">팀</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${teamFilter === 'all' ? 'active' : ''}`}
              onClick={() => onTeamFilterChange('all')}
            >
              전체
            </button>
            <button
              className={`filter-btn black ${teamFilter === 'black' ? 'active' : ''}`}
              onClick={() => onTeamFilterChange('black')}
            >
              흑수저
            </button>
            <button
              className={`filter-btn white ${teamFilter === 'white' ? 'active' : ''}`}
              onClick={() => onTeamFilterChange('white')}
            >
              백수저
            </button>
          </div>
        </div>

        <div className="result-count">
          {restaurants.length}개 레스토랑
        </div>
      </div>

      <div className="list-content">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`restaurant-card ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''} ${restaurant.team}`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="card-header">
              <div className="card-badges">
                <span className={`team-badge ${restaurant.team}`}>
                  {restaurant.team === 'black' ? '흑수저' : '백수저'}
                </span>
                <span className="season-badge-small">S{restaurant.season}</span>
              </div>
              <span className="category">{restaurant.category}</span>
            </div>
            <h3 className="chef-name">{restaurant.chef}</h3>
            <p className="restaurant-name">{restaurant.restaurant}</p>
            <p className="address">{restaurant.address}</p>
            <div className="card-footer">
              <span className="price-tag">{restaurant.priceRange}</span>
              {restaurant.reservation?.type === '캐치테이블' && (
                <span className="reservation-tag">캐치테이블</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantList;
