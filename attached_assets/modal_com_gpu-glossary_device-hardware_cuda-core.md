URL: https://modal.com/gpu-glossary/device-hardware/cuda-core
---
GPU Glossary

TerminalLight greenLight

TABLE OF CONTENTS

[Home](/gpu-glossary)-

[README](/gpu-glossary/readme)

[Device Hardware](/gpu-glossary/device-hardware)-

[CUDA (Device Architecture)](/gpu-glossary/device-hardware/cuda-device-architecture)

[Streaming Multiprocessor\\
SM](/gpu-glossary/device-hardware/streaming-multiprocessor)

[Core](/gpu-glossary/device-hardware/core)

[Special Function Unit\\
SFU](/gpu-glossary/device-hardware/special-function-unit)

[Load/Store Unit\\
LSU](/gpu-glossary/device-hardware/load-store-unit)

[Warp Scheduler](/gpu-glossary/device-hardware/warp-scheduler)

[CUDA Core](/gpu-glossary/device-hardware/cuda-core)

[Tensor Core](/gpu-glossary/device-hardware/tensor-core)

[Streaming Multiprocessor Architecture](/gpu-glossary/device-hardware/streaming-multiprocessor-architecture)

[Texture Processing Cluster\\
TPC](/gpu-glossary/device-hardware/texture-processing-cluster)

[Graphics/GPU Processing Cluster\\
GPC](/gpu-glossary/device-hardware/graphics-processing-cluster)

[Register File](/gpu-glossary/device-hardware/register-file)

[L1 Data Cache](/gpu-glossary/device-hardware/l1-data-cache)

[GPU RAM](/gpu-glossary/device-hardware/gpu-ram)

[Device Software](/gpu-glossary/device-software)-

[CUDA (Programming Model)](/gpu-glossary/device-software/cuda-programming-model)

[Streaming ASSembler\\
SASS](/gpu-glossary/device-software/streaming-assembler)

[Parallel Thread eXecution\\
PTX](/gpu-glossary/device-software/parallel-thread-execution)

[Compute Capability](/gpu-glossary/device-software/compute-capability)

[Thread](/gpu-glossary/device-software/thread)

[Warp](/gpu-glossary/device-software/warp)

[Cooperative Thread Array](/gpu-glossary/device-software/cooperative-thread-array)

[Kernel](/gpu-glossary/device-software/kernel)

[Thread Block](/gpu-glossary/device-software/thread-block)

[Thread Block Grid](/gpu-glossary/device-software/thread-block-grid)

[Memory Hierarchy](/gpu-glossary/device-software/memory-hierarchy)

[Registers](/gpu-glossary/device-software/registers)

[Shared Memory](/gpu-glossary/device-software/shared-memory)

[Global Memory](/gpu-glossary/device-software/global-memory)

[Host Software](/gpu-glossary/host-software)-

[CUDA (Software Platform)](/gpu-glossary/host-software/cuda-software-platform)

[CUDA C++ (programming language)](/gpu-glossary/host-software/cuda-c)

[NVIDIA GPU Drivers](/gpu-glossary/host-software/nvidia-gpu-drivers)

[nvidia.ko](/gpu-glossary/host-software/nvidia-ko)

[CUDA Driver API](/gpu-glossary/host-software/cuda-driver-api)

[libcuda.so](/gpu-glossary/host-software/libcuda)

[NVIDIA Management Library\\
NVML](/gpu-glossary/host-software/nvml)

[libnvml.so](/gpu-glossary/host-software/libnvml)

[nvidia-smi](/gpu-glossary/host-software/nvidia-smi)

[CUDA Runtime API](/gpu-glossary/host-software/cuda-runtime-api)

[libcudart.so](/gpu-glossary/host-software/libcudart)

[NVIDIA CUDA Compiler Driver\\
nvcc](/gpu-glossary/host-software/nvcc)

[NVIDIA Runtime Compiler](/gpu-glossary/host-software/nvrtc)

[NVIDIA CUDA Profiling Tools Interface\\
CUPTI](/gpu-glossary/host-software/cupti)

[NVIDIA Nsight Systems](/gpu-glossary/host-software/nsight-systems)

[CUDA Binary Utilities](/gpu-glossary/host-software/cuda-binary-utilities)

[Contributors](/gpu-glossary/contributors)

/device-hardware/cuda-core

# What is a CUDA Core?

The CUDA Cores are GPU [cores](/gpu-glossary/device-hardware/core) that execute
scalar arithmetic instructions.

![](https://modal-cdn.com/gpu-glossary/terminal-gh100-sm.svg)

The internal architecture of an H100 SM. The CUDA Cores and Tensor Cores are depicted in green. Note the larger size and lower number of Tensor Cores. Modified from NVIDIA's [H100 white paper](https://resources.nvidia.com/en-us-tensor-core).

They are to be contrasted with the
[Tensor Cores](/gpu-glossary/device-hardware/tensor-core), which execute matrix
operations.

Unlike CPU cores, instructions issued to CUDA Cores are not generally
independently scheduled. Instead, groups of cores are issued the same
instruction simultaneously by the
[Warp Scheduler](/gpu-glossary/device-hardware/warp-scheduler) but apply it to
different [registers](/gpu-glossary/device-software/registers). Commonly, these
groups are of size 32, the size of a [warp](/gpu-glossary/device-software/warp),
but for contemporary GPUs groups can contain as little as one thread, at a cost
to performance.

The term "CUDA Core" is slightly slippery: in different
[Streaming Multiprocessor architectures](/gpu-glossary/device-hardware/streaming-multiprocessor-architecture)
CUDA Cores can consist of different units -- a different mixture of 32 bit
integer and 32 bit and 64 bit floating point units.

So, for example, the
[H100 whitepaper](https://resources.nvidia.com/en-us-tensor-core) indicates that
an H100 GPU's
[Streaming Multiprocessors (SMs)](/gpu-glossary/device-hardware/streaming-multiprocessor)
each have 128 "FP32 CUDA Cores", which accurately counts the number of 32 bit
floating point units but is double the number of 32 bit integer or 64 bit
floating point units (as evidenced by the diagram above). For estimating
performance, it's best to look directly at the number of hardware units for a
given operation.

[Warp Scheduler](/gpu-glossary/device-hardware/warp-scheduler)

Something seem wrong?

Or want to contribute?

Email:
[glossary@modal.com](mailto:glossary@modal.com)

[Tensor Core](/gpu-glossary/device-hardware/tensor-core)?