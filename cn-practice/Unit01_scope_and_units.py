#!/usr/bin/env python3
"""Unit 01 - network scope ladder, GB/s vs Gbps, and AWS availability arithmetic.

COVERAGE ids: 01.2 (PAN/LAN/MAN/WAN, WB-L01 p12), 01.5 (NVLink 200 GB/s vs InfiniBand
200 Gbps, WB-L01 p22), 01.8 (99.9% availability and Multi-AZ, WB-L04 p32).
Level: LOW (plain arithmetic written out step by step, no libraries).

Run:  python3 Unit01_scope_and_units.py
"""

# ---------------------------------------------------------------- 01.2 scope ladder (WB-L01 p12)
# Slide ranges: PAN about 1 square metre around a person; LAN 10 m / 100 m / 1 km
# (room, building, campus); MAN about 10 km (city); WAN 100 km / 1000 km (country, continent).
SCOPES = [  # (upper bound in metres, name, example from the slide)
    (1, "PAN", "phone to smartwatch or wireless earbuds"),
    (1_000, "LAN", "home, office building or campus"),
    (10_000, "MAN", "a city network run by a municipality or a large organisation"),
    (float("inf"), "WAN", "branch offices across a country, or the Internet itself"),
]


def scope_for(distance_m):
    """Smallest scope whose upper bound covers the distance."""
    for bound, name, example in SCOPES:
        if distance_m <= bound:
            return name, example
    raise ValueError("unreachable")


# ---------------------------------------------------------------- 01.5 unit conversion
BITS_PER_BYTE = 8


def gbytes_per_s_to_gbps(gbytes_per_s):
    """GB/s (gigabytes per second) -> Gbps (gigabits per second): multiply by 8."""
    return gbytes_per_s * BITS_PER_BYTE


def gbps_to_gbytes_per_s(gbps):
    """Gbps -> GB/s: divide by 8."""
    return gbps / BITS_PER_BYTE


def transfer_time_s(size_gbytes, rate_gbps):
    """Time to move size_gbytes (decimal GB) over a rate_gbps link, ignoring overhead."""
    return size_gbytes * BITS_PER_BYTE / rate_gbps


# ---------------------------------------------------------------- 01.8 availability
HOURS_PER_YEAR = 365 * 24          # 8760 h (non-leap year)


def downtime_hours_per_year(availability):
    return (1 - availability) * HOURS_PER_YEAR


def parallel_availability(a, copies):
    """Service is up if at least one of `copies` independent replicas is up."""
    return 1 - (1 - a) ** copies


def main():
    print("=== Scope ladder (WB-L01 p12) ===")
    for d in (0.5, 30, 800, 8_000, 450_000, 7_000_000):
        name, example = scope_for(d)
        print("%12.1f m -> %s (%s)" % (d, name, example))
    assert scope_for(0.5)[0] == "PAN"
    assert scope_for(800)[0] == "LAN"
    assert scope_for(8_000)[0] == "MAN"
    assert scope_for(450_000)[0] == "WAN"

    print("\n=== GB/s vs Gbps (WB-L01 p22) ===")
    nvlink_gbps = gbytes_per_s_to_gbps(200)          # 200 GB/s NVLink
    ib_gbps = 200                                    # 200 Gbps InfiniBand
    ratio = nvlink_gbps / ib_gbps
    print("NVLink 200 GB/s = 200 x 8 = %d Gbps" % nvlink_gbps)
    print("InfiniBand 200 Gbps = 200 / 8 = %.0f GB/s" % gbps_to_gbytes_per_s(ib_gbps))
    print("Ratio NVLink : InfiniBand = %.0f : 1" % ratio)
    assert nvlink_gbps == 1600 and gbps_to_gbytes_per_s(ib_gbps) == 25 and ratio == 8

    size = 80  # GB of model weights or gradients
    t_nv = transfer_time_s(size, nvlink_gbps)
    t_ib = transfer_time_s(size, ib_gbps)
    print("Moving %d GB: NVLink %.1f s, InfiniBand %.1f s" % (size, t_nv, t_ib))
    assert abs(t_nv - 0.4) < 1e-12 and abs(t_ib - 3.2) < 1e-12

    print("\n=== Availability (WB-L04 p32) ===")
    a = 0.999
    dh = downtime_hours_per_year(a)
    print("99.9%% available -> downtime %.2f h/year = %.1f min/year" % (dh, dh * 60))
    print("                 -> %.1f min per 30-day month" % ((1 - a) * 30 * 24 * 60))
    assert abs(dh - 8.76) < 1e-9
    assert abs((1 - a) * 30 * 24 * 60 - 43.2) < 1e-9
    two = parallel_availability(a, 2)
    print("Two independent AZs at 99.9%% each -> %.4f%% (downtime %.2f s/year)"
          % (two * 100, (1 - two) * HOURS_PER_YEAR * 3600))
    assert abs(two - 0.999999) < 1e-12
    assert abs((1 - two) * HOURS_PER_YEAR * 3600 - 31.536) < 1e-6
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
