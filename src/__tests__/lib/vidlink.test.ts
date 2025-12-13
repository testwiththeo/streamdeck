import { buildVidLinkUrl } from '@/lib/api/vidlink';
import { VIDLINK_BASE } from '@/lib/constants/defaults';

describe('buildVidLinkUrl', () => {
  describe('movie URLs', () => {
    it('builds correct movie URL with tmdbId', () => {
      const url = buildVidLinkUrl({ type: 'movie', tmdbId: 550 });
      expect(url).toBe(`${VIDLINK_BASE}/movie/550`);
    });

    it('throws error when tmdbId is missing for movie', () => {
      expect(() => buildVidLinkUrl({ type: 'movie' })).toThrow('tmdbId is required for movies');
    });

    it('includes options as query params', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: { primaryColor: 'FF0000', autoplay: true },
      });
      expect(url).toContain('primaryColor=FF0000');
      expect(url).toContain('autoplay=true');
    });
  });

  describe('TV URLs', () => {
    it('builds correct TV URL with tmdbId, season, and episode', () => {
      const url = buildVidLinkUrl({ type: 'tv', tmdbId: 1399, season: 1, episode: 5 });
      expect(url).toBe(`${VIDLINK_BASE}/tv/1399/1/5`);
    });

    it('throws error when tmdbId is missing for TV', () => {
      expect(() => buildVidLinkUrl({ type: 'tv', season: 1, episode: 1 })).toThrow(
        'tmdbId, season, and episode are required for TV shows'
      );
    });

    it('throws error when season is missing for TV', () => {
      expect(() => buildVidLinkUrl({ type: 'tv', tmdbId: 1399, episode: 1 })).toThrow(
        'tmdbId, season, and episode are required for TV shows'
      );
    });

    it('throws error when episode is missing for TV', () => {
      expect(() => buildVidLinkUrl({ type: 'tv', tmdbId: 1399, season: 1 })).toThrow(
        'tmdbId, season, and episode are required for TV shows'
      );
    });
  });

  describe('anime URLs', () => {
    it('builds correct anime URL with malId, episode, and subOrDub', () => {
      const url = buildVidLinkUrl({ type: 'anime', malId: 21, episode: 10, subOrDub: 'sub' });
      expect(url).toBe(`${VIDLINK_BASE}/anime/21/10/sub?fallback=true`);
    });

    it('builds correct anime URL with dub', () => {
      const url = buildVidLinkUrl({ type: 'anime', malId: 21, episode: 10, subOrDub: 'dub' });
      expect(url).toBe(`${VIDLINK_BASE}/anime/21/10/dub?fallback=true`);
    });

    it('throws error when malId is missing for anime', () => {
      expect(() => buildVidLinkUrl({ type: 'anime', episode: 1, subOrDub: 'sub' })).toThrow(
        'malId, episode, and subOrDub are required for anime'
      );
    });

    it('uses & separator when path already has query params (anime)', () => {
      const url = buildVidLinkUrl({
        type: 'anime',
        malId: 21,
        episode: 10,
        subOrDub: 'sub',
        options: { primaryColor: 'FF0000' },
      });
      expect(url).toContain('?fallback=true&');
      expect(url).toContain('primaryColor=FF0000');
    });
  });

  describe('unknown type', () => {
    it('throws error for unknown type', () => {
      expect(() =>
        buildVidLinkUrl({ type: 'unknown' as 'movie', tmdbId: 1 })
      ).toThrow('Unknown media type');
    });
  });

  describe('player options', () => {
    it('builds URL with all player options', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: {
          primaryColor: 'B20710',
          secondaryColor: '333333',
          icons: 'vid',
          iconColor: 'FFFFFF',
          title: true,
          poster: false,
          autoplay: true,
          nextbutton: false,
          player: 'jw',
          startAt: 120,
        },
      });

      expect(url).toContain('primaryColor=B20710');
      expect(url).toContain('secondaryColor=333333');
      expect(url).toContain('icons=vid');
      expect(url).toContain('iconColor=FFFFFF');
      expect(url).toContain('title=true');
      expect(url).toContain('poster=false');
      expect(url).toContain('autoplay=true');
      expect(url).toContain('nextbutton=false');
      expect(url).toContain('player=jw');
      expect(url).toContain('startAt=120');
    });

    it('omits startAt when 0 or negative', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: { startAt: 0 },
      });
      expect(url).not.toContain('startAt');
    });

    it('floors fractional startAt', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: { startAt: 120.7 },
      });
      expect(url).toContain('startAt=120');
    });
  });
});
