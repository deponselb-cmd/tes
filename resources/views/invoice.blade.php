@extends('layouts.guest')

@section('title', 'Staff Login')
@section('content')

<div class="text-center mb-6">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        NetBill Pro
    </h2>
    <p class="text-xs text-gray-500 mt-1">Sign in to your account</p>
</div>

<form method="POST" action="{{ route('login') }}">
    @csrf

    <div class="space-y-4">
        {{-- Email --}}
        <div>
            <label for="email" class="text-xs text-gray-400 block mb-1">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                value="{{ old('email') }}"
                placeholder="staff@netbill.co.id"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                required
                autofocus
            />
        </div>

        {{-- Password --}}
        <div>
            <label for="password" class="text-xs text-gray-400 block mb-1">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                required
            />
        </div>

        {{-- Remember Me --}}
        <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" name="remember" class="rounded border-gray-700 bg-gray-800 text-indigo-500 focus:ring-indigo-500" />
                Remember me
            </label>
            <a href="#" class="text-xs text-indigo-400 hover:text-indigo-300 transition">
                Forgot password?
            </a>
        </div>

        {{-- Submit --}}
        <button
            type="submit"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition active:scale-[0.98]"
        >
            Sign In
        </button>
    </div>
</form>

<div class="text-center mt-5">
    <p class="text-xs text-gray-500">
        Don't have an account?
        <a href="{{ route('register') }}" class="text-indigo-400 hover:text-indigo-300 transition ml-1">Register</a>
    </p>
</div>
@endsection
