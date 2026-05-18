@extends('layouts.guest')

@section('title', 'Register Staff')
@section('content')

<div class="text-center mb-6">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        NetBill Pro
    </h2>
    <p class="text-xs text-gray-500 mt-1">Create a new staff account</p>
</div>

<form method="POST" action="{{ route('register') }}">
    @csrf

    <div class="space-y-4">
        <div>
            <label for="name" class="text-xs text-gray-400 block mb-1">Full Name</label>
            <input
                id="name"
                name="name"
                type="text"
                value="{{ old('name') }}"
                placeholder="John Doe"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                required
            />
        </div>

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
            />
        </div>

        <div>
            <label for="password" class="text-xs text-gray-400 block mb-1">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                required
            />
        </div>

        <div>
            <label for="password_confirmation" class="text-xs text-gray-400 block mb-1">Confirm Password</label>
            <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Repeat password"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                required
            />
        </div>

        <button
            type="submit"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition active:scale-[0.98]"
        >
            Register
        </button>
    </div>
</form>

<div class="text-center mt-5">
    <p class="text-xs text-gray-500">
        Already have an account?
        <a href="{{ route('login') }}" class="text-indigo-400 hover:text-indigo-300 transition ml-1">Sign in</a>
    </p>
</div>
@endsection
