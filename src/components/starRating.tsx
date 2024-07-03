import { memo } from 'react';
import 'media/css/starRating.scss';

const StarRating = memo(function StarRatingComponent({ num }: { num: number }) {
  switch (num) {
    case 1:
      return (
        <div className="star_wrap">
          <span className="star checked"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </div>
      );
    case 2:
      return (
        <div className="star_wrap">
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </div>
      );
    case 3:
      return (
        <div className="star_wrap">
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star"></span>
          <span className="star"></span>
        </div>
      );
    case 4:
      return (
        <div className="star_wrap">
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star"></span>
        </div>
      );
    case 5:
      return (
        <div className="star_wrap">
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
          <span className="star checked"></span>
        </div>
      );
  }
});

export default StarRating;
