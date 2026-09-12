import { describe, expect, it } from 'vitest';
import { resolveBadgeDesign } from './badge-design';

describe('badge design fallbacks', () => {
  it('디자인을 생략해도 모든 필수 색상을 제공한다', () => {
    expect(resolveBadgeDesign()).toMatchObject({ backgroundColor: '#fafafa', textColor: '#252629', strapColor: '#696b70', strapBorderColor: '#696b70' });
  });
  it('줄 바탕색만 입력하면 기본 테두리를 같은 색으로 바꾼다', () => {
    expect(resolveBadgeDesign({ strapColor: '#123456' })).toMatchObject({ strapColor: '#123456', strapBorderColor: '#123456' });
  });
  it('명시한 테두리와 배경 이미지는 기본값으로 덮어쓰지 않는다', () => {
    expect(resolveBadgeDesign({ strapColor: '#123456', strapBorderColor: '#abcdef', backgroundImage: '/badge.svg' })).toMatchObject({ strapBorderColor: '#abcdef', backgroundImage: '/badge.svg' });
  });
});
